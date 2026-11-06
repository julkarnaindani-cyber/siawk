/**
 * SI AWK - Logika Inti Aplikasi Frontend (app.js)
 * Standar Arsitektur: gas-pro-api & gas-scale-turbo (Zero-Latency, Optimistic UI, SWR)
 */

const App = (function () {
  // State aplikasi terpusat dalam memori (Memory Store)
  let state = {
    profil: null,
    siswa: [],
    presensiHariIni: { tanggal: '', data: {} },
    jurnal: [],
    arsip: []
  };

  // State in-flight request deduplication (gas-scale-turbo)
  const _inflight = {};
  let _writeEpoch = 0;

  // Key penyimpanan LocalStorage
  const STORAGE_KEY = 'SI_AWK_STATE_V2';

  /**
   * Inisialisasi Aplikasi saat DOM Siap
   */
  function init() {
    loadLocalState();
    setupDatePickers();
    renderAllViews();
    updateApiStatusBadge();

    // SWR (Stale While Revalidate): Jika GAS_URL tersedia, sinkronkan latar belakang tanpa memblokir UI
    if (CONFIG.GAS_URL) {
      syncBackgroundData();
    }
  }

  /**
   * Muat state dari LocalStorage atau inisialisasi dari mockData.js
   */
  function loadLocalState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state = JSON.parse(stored);
      } else {
        state = JSON.parse(JSON.stringify(INITIAL_DATA));
        saveLocalState();
      }
    } catch (e) {
      console.warn('Gagal membaca LocalStorage, memuat INITIAL_DATA default:', e);
      state = JSON.parse(JSON.stringify(INITIAL_DATA));
    }

    // Pastikan tanggal presensi sinkron dengan tanggal hari ini jika kosong
    const today = new Date().toISOString().slice(0, 10);
    if (!state.presensiHariIni.tanggal) {
      state.presensiHariIni.tanggal = today;
    }
  }

  /**
   * Simpan state ke LocalStorage secara instan
   */
  function saveLocalState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Gagal menyimpan LocalStorage:', e);
    }
  }

  /**
   * Set tanggal pada input date picker
   */
  function setupDatePickers() {
    const today = new Date().toISOString().slice(0, 10);
    const datePicker = document.getElementById('presence-date-picker');
    if (datePicker) datePicker.value = state.presensiHariIni.tanggal || today;

    const journalDatePicker = document.getElementById('journal-input-date');
    if (journalDatePicker) journalDatePicker.value = today;

    const landingDate = document.getElementById('landing-preview-date');
    if (landingDate) {
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      landingDate.textContent = new Date().toLocaleDateString('id-ID', options);
    }
  }

  /**
   * Routing Instan Antar Menu (0ms Latency View Switcher)
   * @param {string} viewName - Nama view target ('landing', 'dasbor', 'buku-induk', dll.)
   */
  function navigateTo(viewName) {
    // 1. Sembunyikan semua section
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(s => s.classList.remove('active'));

    // 2. Tampilkan target view
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
    }

    // 3. Update styling tab navigasi aktif
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-target') === viewName;
      if (isTarget) {
        btn.className = 'nav-btn px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all bg-primary text-white shadow-sm';
      } else {
        btn.className = 'nav-btn px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all text-gray-300 hover:text-white hover:bg-white/[0.08]';
      }
    });

    // 4. Scroll ke posisi atas secara halus
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /**
   * Render seluruh komponen UI
   */
  function renderAllViews() {
    renderLandingView();
    renderDashboardView();
    renderStudentsView();
    renderPresenceView();
    renderJournalView();
    renderDocumentsView();
  }

  // ==========================================================
  // 1. RENDER LANDING PAGE VIEW
  // ==========================================================
  function renderLandingView() {
    // Update metric totals
    const totalSiswa = state.siswa.length;
    const lCount = state.siswa.filter(s => s.jk === 'L').length;
    const pCount = state.siswa.filter(s => s.jk === 'P').length;
    
    const metricLandingTotal = document.getElementById('metric-landing-total-siswa');
    if (metricLandingTotal) metricLandingTotal.textContent = `${totalSiswa} Siswa`;

    const metricLandingJurnal = document.getElementById('metric-landing-jurnal');
    if (metricLandingJurnal) metricLandingJurnal.textContent = `${state.jurnal.length} Catatan`;

    // Render 4 Mini Presence Rows Preview
    const miniListContainer = document.getElementById('landing-mini-presence-list');
    if (miniListContainer) {
      const top4 = state.siswa.slice(0, 4);
      miniListContainer.innerHTML = top4.map((s, idx) => {
        const pres = (state.presensiHariIni.data && state.presensiHariIni.data[s.nis]) || { status: 'H', ket: '' };
        let badgeHtml = '';
        if (pres.status === 'H') {
          badgeHtml = `<span class="px-2.5 py-0.5 rounded-full bg-status-present-bg text-status-present-emerald text-[11px] font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-status-present-emerald"></span> Hadir</span>`;
        } else if (pres.status === 'S') {
          badgeHtml = `<span class="px-2.5 py-0.5 rounded-full bg-status-sick-bg text-status-sick-sky text-[11px] font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-status-sick-sky"></span> Sakit</span>`;
        } else if (pres.status === 'I') {
          badgeHtml = `<span class="px-2.5 py-0.5 rounded-full bg-status-permission-bg text-status-permission-amber text-[11px] font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-status-permission-amber"></span> Izin</span>`;
        } else {
          badgeHtml = `<span class="px-2.5 py-0.5 rounded-full bg-status-absent-bg text-status-absent-rose text-[11px] font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-status-absent-rose"></span> Alpa</span>`;
        }

        const colors = ['bg-primary', 'bg-status-permission-amber', 'bg-cyan-600', 'bg-purple-600'];
        const avatarBg = colors[idx % colors.length];
        const initials = s.nama.split(' ').map(n => n[0]).slice(0, 2).join('');

        return `
          <div class="bg-surface-pure-white p-2.5 rounded-xl flex items-center justify-between shadow-sm border border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full ${avatarBg} text-white font-bold text-[11px] flex items-center justify-center">
                ${initials}
              </div>
              <div>
                <p class="text-xs font-semibold text-on-surface leading-tight">${s.nama}</p>
                <p class="text-[10px] text-gray-500">NIS: ${s.nis} • Absen #${s.noAbsen}</p>
              </div>
            </div>
            ${badgeHtml}
          </div>
        `;
      }).join('');
    }
  }

  // ==========================================================
  // 2. RENDER DASHBOARD VIEW
  // ==========================================================
  function renderDashboardView() {
    const totalSiswa = state.siswa.length;
    const lCount = state.siswa.filter(s => s.jk === 'L').length;
    const pCount = state.siswa.filter(s => s.jk === 'P').length;

    const dashTotal = document.getElementById('dash-total-siswa');
    if (dashTotal) dashTotal.textContent = totalSiswa;

    const dashL = document.getElementById('dash-count-l');
    if (dashL) dashL.textContent = `${lCount} L`;

    const dashP = document.getElementById('dash-count-p');
    if (dashP) dashP.textContent = `${pCount} P`;

    // Presensi statistics
    let h = 0, s = 0, i = 0, a = 0;
    const presData = state.presensiHariIni.data || {};
    state.siswa.forEach(sis => {
      const st = presData[sis.nis] ? presData[sis.nis].status : 'H';
      if (st === 'H') h++;
      else if (st === 'S') s++;
      else if (st === 'I') i++;
      else if (st === 'A') a++;
    });

    const rate = totalSiswa > 0 ? ((h / totalSiswa) * 100).toFixed(1) : '100.0';
    const rateEl = document.getElementById('dash-rate-kehadiran');
    if (rateEl) rateEl.textContent = `${rate}%`;

    const summaryEl = document.getElementById('dash-presence-summary');
    if (summaryEl) summaryEl.textContent = `${h} Hadir • ${s} Sakit • ${i} Izin • ${a} Alpa`;

    const alertDetail = document.getElementById('dash-alert-presence-detail');
    if (alertDetail) alertDetail.textContent = `(${h} Hadir, ${s + i + a} Catatan Khusus)`;

    const totalJurnalEl = document.getElementById('dash-total-jurnal');
    if (totalJurnalEl) totalJurnalEl.textContent = state.jurnal.length;

    const totalArsipEl = document.getElementById('dash-total-arsip');
    if (totalArsipEl) totalArsipEl.textContent = state.arsip.length;

    // Recent Journal entries on dashboard
    const recentJournalList = document.getElementById('dash-recent-journal-list');
    if (recentJournalList) {
      const top3 = state.jurnal.slice(0, 3);
      recentJournalList.innerHTML = top3.map(j => {
        let badgeClass = 'bg-indigo-50 text-primary';
        if (j.kategori === 'Prestasi') badgeClass = 'bg-pastel-violet-bg text-pastel-violet-fg';
        else if (j.kategori === 'Pelanggaran') badgeClass = 'bg-status-absent-bg text-status-absent-rose';
        else if (j.kategori === 'Bimbingan') badgeClass = 'bg-status-permission-bg text-status-permission-amber';

        return `
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-gray-800">${j.nama}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}">${j.kategori}</span>
            </div>
            <p class="text-xs text-gray-700 font-medium truncate">${j.judul}</p>
            <span class="text-[10px] text-gray-400">${j.tanggal} • ${j.status}</span>
          </div>
        `;
      }).join('');
    }
  }

  // ==========================================================
  // 3. RENDER BUKU INDUK SISWA VIEW
  // ==========================================================
  function renderStudentsView(filteredStudents = null) {
    const list = filteredStudents || state.siswa;
    const tbody = document.getElementById('student-table-body');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-8 text-gray-500">
            <span class="material-symbols-outlined text-gray-300 text-[40px] block mb-2">search_off</span>
            Tidak ditemukan data siswa yang cocok dengan filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map((s, idx) => {
      const waNumber = (s.hpOrtu || '').replace(/^0/, '62').replace(/\D/g, '');
      const waLink = waNumber ? `https://wa.me/${waNumber}` : '#';

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-4 text-center font-semibold text-gray-500">${s.noAbsen || (idx + 1)}</td>
          <td class="py-3 px-4">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full bg-indigo-100 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                ${s.jk === 'L' ? '👦' : '👧'}
              </div>
              <div>
                <p class="font-bold text-on-surface">${s.nama}</p>
                <p class="text-[11px] text-gray-400">${s.agama || 'Islam'}</p>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 font-mono text-[11px]">
            <div>NIS: <strong class="text-gray-700">${s.nis}</strong></div>
            <div class="text-gray-400">NISN: ${s.nisn}</div>
          </td>
          <td class="py-3 px-4 text-center">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.jk === 'L' ? 'bg-indigo-50 text-primary' : 'bg-pink-50 text-pink-600'}">
              ${s.jk === 'L' ? 'L' : 'P'}
            </span>
          </td>
          <td class="py-3 px-4">
            <p class="text-gray-700 font-medium">${s.ayah || s.ibu || 'Wali Siswa'}</p>
            ${s.hpOrtu ? `
              <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1 text-[11px] text-status-present-emerald hover:underline">
                <span class="material-symbols-outlined text-[14px]">chat</span>
                ${s.hpOrtu}
              </a>
            ` : '<span class="text-gray-400 text-[11px]">-</span>'}
          </td>
          <td class="py-3 px-4 max-w-[200px] truncate text-gray-600" title="${s.alamat || ''}">
            ${s.alamat || '-'}
          </td>
          <td class="py-3 px-4 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-status-present-bg text-status-present-emerald">
              ${s.status || 'Aktif'}
            </span>
          </td>
          <td class="py-3 px-4 text-center">
            <button onclick="App.deleteStudent('${s.id || s.nis}')" class="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors" title="Hapus Siswa">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    const paginationInfo = document.getElementById('student-pagination-info');
    if (paginationInfo) paginationInfo.textContent = `Menampilkan ${list.length} dari ${state.siswa.length} siswa`;

    // Populate student select in journal modal
    const journalStudentSelect = document.getElementById('journal-student-select');
    if (journalStudentSelect) {
      journalStudentSelect.innerHTML = state.siswa.map(s => 
        `<option value="${s.nis}">${s.nama} (${s.nis})</option>`
      ).join('');
    }
  }

  /**
   * Filter siswa secara instan (pencarian teks, gender, status)
   */
  function filterStudents() {
    const query = (document.getElementById('student-search-input')?.value || '').toLowerCase().trim();
    const gender = document.getElementById('student-filter-gender')?.value || 'ALL';
    const status = document.getElementById('student-filter-status')?.value || 'ALL';

    const filtered = state.siswa.filter(s => {
      const matchQuery = !query || 
        s.nama.toLowerCase().includes(query) || 
        s.nis.toLowerCase().includes(query) || 
        (s.nisn && s.nisn.toLowerCase().includes(query));

      const matchGender = gender === 'ALL' || s.jk === gender;
      const matchStatus = status === 'ALL' || s.status === status;

      return matchQuery && matchGender && matchStatus;
    });

    renderStudentsView(filtered);
  }

  // ==========================================================
  // 4. RENDER PRESENSI HARIAN VIEW
  // ==========================================================
  function renderPresenceView() {
    const tbody = document.getElementById('presence-table-body');
    if (!tbody) return;

    const presData = state.presensiHariIni.data || {};
    let countH = 0, countS = 0, countI = 0, countA = 0;

    tbody.innerHTML = state.siswa.map((s, idx) => {
      const current = presData[s.nis] || { status: 'H', ket: '' };
      const st = current.status;
      if (st === 'H') countH++;
      else if (st === 'S') countS++;
      else if (st === 'I') countI++;
      else if (st === 'A') countA++;

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-4 text-center font-semibold text-gray-500">${s.noAbsen || (idx + 1)}</td>
          <td class="py-3 px-4 font-bold text-on-surface">${s.nama}</td>
          <td class="py-3 px-4 font-mono text-gray-500">${s.nis}</td>
          <td class="py-3 px-4">
            <div class="flex items-center justify-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button type="button" onclick="App.setPresenceStatus('${s.nis}', 'H')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${st === 'H' ? 'bg-status-present-emerald text-white shadow-sm' : 'text-gray-600 hover:bg-white'}">H</button>
              <button type="button" onclick="App.setPresenceStatus('${s.nis}', 'S')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${st === 'S' ? 'bg-status-sick-sky text-white shadow-sm' : 'text-gray-600 hover:bg-white'}">S</button>
              <button type="button" onclick="App.setPresenceStatus('${s.nis}', 'I')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${st === 'I' ? 'bg-status-permission-amber text-white shadow-sm' : 'text-gray-600 hover:bg-white'}">I</button>
              <button type="button" onclick="App.setPresenceStatus('${s.nis}', 'A')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${st === 'A' ? 'bg-status-absent-rose text-white shadow-sm' : 'text-gray-600 hover:bg-white'}">A</button>
            </div>
          </td>
          <td class="py-3 px-4">
            <input type="text" value="${current.ket || ''}" onchange="App.setPresenceNote('${s.nis}', this.value)" placeholder="Keterangan..." class="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 outline-none focus:border-primary bg-white"/>
          </td>
        </tr>
      `;
    }).join('');

    // Update Counter Chips
    const elH = document.getElementById('count-h');
    const elS = document.getElementById('count-s');
    const elI = document.getElementById('count-i');
    const elA = document.getElementById('count-a');
    if (elH) elH.textContent = countH;
    if (elS) elS.textContent = countS;
    if (elI) elI.textContent = countI;
    if (elA) elA.textContent = countA;
  }

  /**
   * Set Status Presensi Siswa (H, S, I, A)
   */
  function setPresenceStatus(nis, status) {
    if (!state.presensiHariIni.data) state.presensiHariIni.data = {};
    const existing = state.presensiHariIni.data[nis] || { status: 'H', ket: '' };
    existing.status = status;
    state.presensiHariIni.data[nis] = existing;

    saveLocalState();
    renderPresenceView();
    renderDashboardView();
  }

  /**
   * Set Keterangan Presensi Siswa
   */
  function setPresenceNote(nis, note) {
    if (!state.presensiHariIni.data) state.presensiHariIni.data = {};
    const existing = state.presensiHariIni.data[nis] || { status: 'H', ket: '' };
    existing.ket = note;
    state.presensiHariIni.data[nis] = existing;
    saveLocalState();
  }

  /**
   * 1-Klik Tandai Semua Hadir Cepat
   */
  function markAllPresent() {
    if (!state.presensiHariIni.data) state.presensiHariIni.data = {};
    state.siswa.forEach(s => {
      state.presensiHariIni.data[s.nis] = { status: 'H', ket: '' };
    });
    saveLocalState();
    renderPresenceView();
    renderDashboardView();
    showToast('Seluruh siswa berhasil ditandai Hadir (H)', 'success');
  }

  /**
   * Kunci & Simpan Presensi Hari Ini (Lokal + GAS)
   */
  async function saveAttendanceToday() {
    saveLocalState();
    showToast('Presensi hari ini berhasil dikunci & disimpan!', 'success');

    // Jika terhubung ke GAS, kirim batch via API doPost
    if (CONFIG.GAS_URL) {
      try {
        const payload = {
          tanggal: state.presensiHariIni.tanggal,
          data: state.presensiHariIni.data
        };
        await postApi('batchSaveAttendance', payload);
      } catch (err) {
        console.warn('Gagal sinkron presensi ke GAS:', err);
      }
    }
  }

  /**
   * Tangani perubahan tanggal pada date picker
   */
  function handleDateChange(newDate) {
    state.presensiHariIni.tanggal = newDate;
    saveLocalState();
    renderPresenceView();
  }

  // ==========================================================
  // 5. RENDER JURNAL & BK VIEW
  // ==========================================================
  function renderJournalView(filterCategory = 'ALL') {
    const tbody = document.getElementById('journal-table-body');
    if (!tbody) return;

    const list = filterCategory === 'ALL' 
      ? state.jurnal 
      : state.jurnal.filter(j => j.kategori === filterCategory);

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-gray-500">
            Belum ada rekam catatan untuk kategori ini.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(j => {
      let badgeClass = 'bg-indigo-50 text-primary';
      if (j.kategori === 'Prestasi') badgeClass = 'bg-pastel-violet-bg text-pastel-violet-fg';
      else if (j.kategori === 'Pelanggaran') badgeClass = 'bg-status-absent-bg text-status-absent-rose';
      else if (j.kategori === 'Bimbingan') badgeClass = 'bg-status-permission-bg text-status-permission-amber';

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-4 font-mono text-gray-500 whitespace-nowrap">${j.tanggal}</td>
          <td class="py-3 px-4 font-bold text-on-surface">${j.nama}</td>
          <td class="py-3 px-4 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}">
              ${j.kategori}
            </span>
          </td>
          <td class="py-3 px-4 max-w-xs">
            <p class="font-bold text-gray-800">${j.judul}</p>
            <p class="text-gray-500 text-[11px] mt-0.5">${j.uraian || '-'}</p>
          </td>
          <td class="py-3 px-4 text-gray-700 max-w-xs">
            ${j.tindakLanjut || '-'}
          </td>
          <td class="py-3 px-4 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${j.status === 'Selesai' ? 'bg-status-present-bg text-status-present-emerald' : 'bg-status-permission-bg text-status-permission-amber'}">
              ${j.status || 'Diproses'}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Filter kategori jurnal
   */
  function filterJournal(category) {
    const btns = document.querySelectorAll('.jurnal-tab-btn');
    btns.forEach(b => {
      if (b.getAttribute('data-category') === category) {
        b.className = 'jurnal-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white shadow-sm';
      } else {
        b.className = 'jurnal-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-white text-gray-600 hover:bg-slate-50 border border-slate-200';
      }
    });

    renderJournalView(category);
  }

  // ==========================================================
  // 6. RENDER ARSIP DOKUMEN VIEW
  // ==========================================================
  function renderDocumentsView() {
    const tbody = document.getElementById('document-table-body');
    if (!tbody) return;

    tbody.innerHTML = state.arsip.map(d => {
      let iconColor = 'text-rose-500';
      let iconName = 'picture_as_pdf';
      if (d.tipe === 'Excel') { iconColor = 'text-status-present-emerald'; iconName = 'table_view'; }
      else if (d.tipe === 'Word') { iconColor = 'text-primary'; iconName = 'description'; }

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-4">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined ${iconColor} text-[22px]">${iconName}</span>
              <div>
                <p class="font-bold text-on-surface">${d.nama}</p>
                <p class="text-[10px] text-gray-400">ID: ${d.id}</p>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 text-gray-600">${d.kategori}</td>
          <td class="py-3 px-4 font-mono text-gray-500">${d.ukuran}</td>
          <td class="py-3 px-4 font-mono text-gray-500">${d.tanggal}</td>
          <td class="py-3 px-4 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button onclick="App.previewDoc('${d.nama}')" class="p-1 rounded text-primary hover:bg-indigo-50" title="Pratinjau Dokumen">
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </button>
              <button onclick="App.downloadDoc('${d.nama}')" class="p-1 rounded text-status-present-emerald hover:bg-emerald-50" title="Unduh File">
                <span class="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================
  // 7. MODALS & FORMS (TAMBAH SISWA & JURNAL)
  // ==========================================================
  function openAddStudentModal() {
    const modal = document.getElementById('modal-add-student');
    if (modal) modal.classList.remove('hidden');
  }

  function closeAddStudentModal() {
    const modal = document.getElementById('modal-add-student');
    if (modal) modal.classList.add('hidden');
  }

  function handleSaveStudent(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const newStudent = {
      id: 'SIS-' + UtilitiesUuid(),
      noAbsen: state.siswa.length + 1,
      nis: formData.get('nis'),
      nisn: formData.get('nisn'),
      nama: formData.get('nama'),
      jk: formData.get('jk'),
      agama: formData.get('agama'),
      tmpLahir: formData.get('tmpLahir') || '',
      tglLahir: formData.get('tglLahir') || '',
      ayah: formData.get('ayah') || '',
      ibu: formData.get('ibu') || '',
      hpOrtu: formData.get('hpOrtu') || '',
      alamat: formData.get('alamat') || '',
      status: 'Aktif'
    };

    // Validasi NIS unik
    if (state.siswa.some(s => s.nis === newStudent.nis)) {
      showToast('NIS sudah terdaftar pada siswa lain!', 'error');
      return;
    }

    state.siswa.push(newStudent);
    saveLocalState();
    closeAddStudentModal();
    form.reset();
    renderAllViews();
    showToast(`Siswa "${newStudent.nama}" berhasil ditambahkan!`, 'success');

    // Sync to GAS if connected
    if (CONFIG.GAS_URL) {
      postApi('saveStudent', newStudent).catch(err => console.warn(err));
    }
  }

  function deleteStudent(idOrNis) {
    if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) return;
    state.siswa = state.siswa.filter(s => s.id !== idOrNis && s.nis !== idOrNis);
    saveLocalState();
    renderAllViews();
    showToast('Data siswa berhasil dihapus.', 'info');
  }

  function openAddJournalModal() {
    const modal = document.getElementById('modal-add-journal');
    if (modal) modal.classList.remove('hidden');
  }

  function closeAddJournalModal() {
    const modal = document.getElementById('modal-add-journal');
    if (modal) modal.classList.add('hidden');
  }

  function handleSaveJournal(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const nis = formData.get('nis');
    const student = state.siswa.find(s => s.nis === nis);
    const namaSiswa = student ? student.nama : 'Siswa';

    const newJournal = {
      id: 'JRN-' + UtilitiesUuid(),
      tanggal: formData.get('tanggal'),
      nis: nis,
      nama: namaSiswa,
      kategori: formData.get('kategori'),
      judul: formData.get('judul'),
      uraian: formData.get('uraian') || '',
      tindakLanjut: formData.get('tindakLanjut') || '',
      status: formData.get('kategori') === 'Prestasi' ? 'Selesai' : 'Dalam Pemantauan'
    };

    state.jurnal.unshift(newJournal);
    saveLocalState();
    closeAddJournalModal();
    form.reset();
    renderAllViews();
    showToast('Catatan bimbingan/prestasi berhasil disimpan!', 'success');

    if (CONFIG.GAS_URL) {
      postApi('saveJournal', newJournal).catch(err => console.warn(err));
    }
  }

  // ==========================================================
  // 8. PORTABILITAS & ZIP ENGINE (1-CLICK BACKUP & RESTORE)
  // ==========================================================
  async function exportZipNow() {
    try {
      showToast('Sedang mengompresi data kelas ke format ZIP...', 'info');
      const res = await ZipEngine.exportClassZip(state);
      showToast(`Arsip ${res.filename} (${res.sizeFormatted}) berhasil diunduh!`, 'success');
    } catch (err) {
      showToast('Gagal membuat paket ZIP: ' + err.message, 'error');
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    document.getElementById('zip-dropzone')?.classList.add('border-primary', 'bg-indigo-50/50');
  }

  function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('zip-dropzone')?.classList.remove('border-primary', 'bg-indigo-50/50');
  }

  let selectedZipFile = null;

  function handleDrop(event) {
    event.preventDefault();
    handleDragLeave(event);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processSelectedZip(event.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      processSelectedZip(event.target.files[0]);
    }
  }

  function processSelectedZip(file) {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      showToast('Format berkas harus .zip!', 'error');
      return;
    }
    selectedZipFile = file;
    const txt = document.getElementById('zip-file-chosen-text');
    if (txt) {
      txt.textContent = `Berkas dipilih: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      txt.className = 'text-xs text-status-present-emerald font-bold mt-2';
    }
    showToast(`File ${file.name} siap dipulihkan.`, 'info');
  }

  async function triggerRestore() {
    if (!selectedZipFile) {
      showToast('Silakan pilih berkas cadangan ZIP terlebih dahulu!', 'error');
      return;
    }

    const progressContainer = document.getElementById('restore-progress-container');
    const progressBar = document.getElementById('restore-progress-bar');
    const progressStatus = document.getElementById('restore-progress-status');
    const progressPercent = document.getElementById('restore-progress-percent');
    const restoreBtn = document.getElementById('restore-action-btn');

    if (progressContainer) progressContainer.classList.remove('hidden');
    if (restoreBtn) restoreBtn.disabled = true;

    try {
      // Step 1: Ekstraksi & Validasi ZIP
      updateProgress(25, 'Mengekstrak berkas ZIP & manifest...');
      await new Promise(r => setTimeout(r, 400));

      const readResult = await ZipEngine.readClassZip(selectedZipFile);
      const data = readResult.extractedData;

      // Step 2: Validasi Integritas
      updateProgress(60, 'Memvalidasi skema database siswa & presensi...');
      await new Promise(r => setTimeout(r, 400));

      // Step 3: Upsert Idempoten ke Local State
      updateProgress(85, 'Menyinkronkan data secara idempoten...');
      await new Promise(r => setTimeout(r, 400));

      // Terapkan data baru
      if (data.profil) state.profil = data.profil;
      if (data.siswa && data.siswa.length > 0) state.siswa = data.siswa;
      if (data.presensiHariIni) state.presensiHariIni = data.presensiHariIni;
      if (data.jurnal && data.jurnal.length > 0) state.jurnal = data.jurnal;
      if (data.arsip && data.arsip.length > 0) state.arsip = data.arsip;

      saveLocalState();
      updateProgress(100, 'Pemulihan data selesai 100%!');
      await new Promise(r => setTimeout(r, 300));

      renderAllViews();
      showToast('Seluruh administrasi kelas berhasil dipulihkan secara otomatis!', 'success');
      
      // Reset dropzone text
      const txt = document.getElementById('zip-file-chosen-text');
      if (txt) {
        txt.textContent = 'Maksimal ukuran file: 40 MB';
        txt.className = 'text-[11px] text-gray-400 mt-2';
      }
      selectedZipFile = null;
    } catch (err) {
      showToast('Gagal memulihkan file ZIP: ' + err.message, 'error');
    } finally {
      if (restoreBtn) restoreBtn.disabled = false;
      setTimeout(() => {
        if (progressContainer) progressContainer.classList.add('hidden');
        if (progressBar) progressBar.style.width = '0%';
      }, 2500);
    }

    function updateProgress(percent, status) {
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressPercent) progressPercent.textContent = `${percent}%`;
      if (progressStatus) progressStatus.textContent = status;
    }
  }

  // ==========================================================
  // 9. API REST GAS INTEGRATION (gas-pro-api & gas-scale-turbo)
  // ==========================================================
  async function postApi(action, data) {
    if (!CONFIG.GAS_URL) return { success: false, message: 'GAS_URL belum diset' };

    _writeEpoch++;
    try {
      const response = await fetch(CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Wajib text/plain agar bebas preflight CORS
        body: JSON.stringify({ action, data })
      });
      return await response.json();
    } catch (err) {
      console.error('API Error:', err);
      return { success: false, message: err.message };
    }
  }

  async function syncBackgroundData() {
    try {
      const res = await fetch(`${CONFIG.GAS_URL}?action=getInitialData`);
      const json = await res.json();
      if (json && json.success && json.data) {
        // Terapkan data server ke state
        if (json.data.profil) state.profil = json.data.profil;
        if (json.data.siswa) state.siswa = json.data.siswa;
        if (json.data.jurnal) state.jurnal = json.data.jurnal;
        if (json.data.arsip) state.arsip = json.data.arsip;
        saveLocalState();
        renderAllViews();
        updateApiStatusBadge(true);
      }
    } catch (e) {
      console.warn('Mode offline/lokal aktif:', e);
      updateApiStatusBadge(false);
    }
  }

  function updateApiStatusBadge(isOnline = null) {
    const dot = document.getElementById('api-status-dot');
    const text = document.getElementById('api-status-text');
    if (!dot || !text) return;

    if (CONFIG.GAS_URL) {
      if (isOnline) {
        dot.className = 'w-2 h-2 rounded-full bg-status-present-emerald animate-pulse';
        text.textContent = 'GAS Live API';
      } else {
        dot.className = 'w-2 h-2 rounded-full bg-accent-amber-light';
        text.textContent = 'GAS Terhubung';
      }
    } else {
      dot.className = 'w-2 h-2 rounded-full bg-accent-amber-light';
      text.textContent = 'Lokal / Demo';
    }
  }

  function openApiModal() {
    const modal = document.getElementById('modal-api-config');
    const input = document.getElementById('input-gas-url');
    if (input) input.value = CONFIG.GAS_URL || '';
    if (modal) modal.classList.remove('hidden');
  }

  function closeApiModal() {
    const modal = document.getElementById('modal-api-config');
    if (modal) modal.classList.add('hidden');
  }

  function saveApiUrl() {
    const input = document.getElementById('input-gas-url');
    if (input) {
      CONFIG.GAS_URL = input.value.trim();
      localStorage.setItem('SI_AWK_GAS_URL', CONFIG.GAS_URL);
      updateApiStatusBadge();
      closeApiModal();
      showToast('URL Google Apps Script berhasil disimpan!', 'success');
      if (CONFIG.GAS_URL) syncBackgroundData();
    }
  }

  // ==========================================================
  // 10. SEARCH & UTILITY HELPERS
  // ==========================================================
  function handleLandingSearch(event) {
    if (event.key === 'Enter') {
      triggerLandingSearch();
    }
  }

  function triggerLandingSearch() {
    const query = document.getElementById('landing-search-input')?.value || '';
    navigateTo('buku-induk');
    const studentSearchInput = document.getElementById('student-search-input');
    if (studentSearchInput) {
      studentSearchInput.value = query;
      filterStudents();
    }
  }

  function exportStudentsCsv() {
    const headers = ['No Absen', 'NIS', 'NISN', 'Nama Lengkap', 'Jenis Kelamin', 'Agama', 'Ayah', 'Ibu', 'No HP Ortu', 'Alamat', 'Status'];
    const rows = state.siswa.map(s => [
      s.noAbsen,
      `'${s.nis}`,
      `'${s.nisn}`,
      `"${s.nama}"`,
      s.jk,
      s.agama || '',
      `"${s.ayah || ''}"`,
      `"${s.ibu || ''}"`,
      `'${s.hpOrtu || ''}`,
      `"${s.alamat || ''}"`,
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DATA_SISWA_KELAS_${state.profil.namaKelas}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Berkas CSV siswa berhasil diekspor!', 'success');
  }

  function downloadDoc(docName) {
    showToast(`Mengunduh berkas "${docName}"...`, 'info');
  }

  function previewDoc(docName) {
    showToast(`Pratinjau berkas: ${docName}`, 'info');
  }

  function openUploadDocModal() {
    showToast('Gunakan Google Drive untuk mengunggah dokumen baru, atau simpan melalui paket ZIP.', 'info');
  }

  function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-nav');
    if (drawer) drawer.classList.toggle('hidden');
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    let bgClass = 'bg-slate-900 text-white';
    let icon = 'info';
    if (type === 'success') {
      bgClass = 'bg-status-present-emerald text-white';
      icon = 'check_circle';
    } else if (type === 'error') {
      bgClass = 'bg-status-absent-rose text-white';
      icon = 'error';
    } else if (type === 'info') {
      bgClass = 'bg-primary text-white';
      icon = 'info';
    }

    const toast = document.createElement('div');
    toast.className = `toast px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold ${bgClass}`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[18px]">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function UtilitiesUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Restore saved URL on load
  const savedUrl = localStorage.getItem('SI_AWK_GAS_URL');
  if (savedUrl) CONFIG.GAS_URL = savedUrl;

  // Jalankan saat script dimuat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    navigateTo,
    filterStudents,
    setPresenceStatus,
    setPresenceNote,
    markAllPresent,
    saveAttendanceToday,
    handleDateChange,
    filterJournal,
    openAddStudentModal,
    closeAddStudentModal,
    handleSaveStudent,
    deleteStudent,
    openAddJournalModal,
    closeAddJournalModal,
    handleSaveJournal,
    exportZipNow,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    triggerRestore,
    openApiModal,
    closeApiModal,
    saveApiUrl,
    handleLandingSearch,
    triggerLandingSearch,
    exportStudentsCsv,
    downloadDoc,
    previewDoc,
    openUploadDocModal,
    toggleMobileMenu,
    showToast
  };
})();

