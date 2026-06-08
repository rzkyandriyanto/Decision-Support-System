export interface Student {
  nim: string;
  name: string;
  class_name: string;
  ipk: number;
  sks_total: number;
  count_c: number;
  count_d: number;
  count_e: number;
  bad_grades?: { course: string, grade: string, sks: number }[];
  pm_status?: string;
  pm_score?: number;
  last_updated?: Date;
}

// ==========================================
// LANGKAH 1: Pemetaan Nilai ke Skala (1-5)
// ==========================================

function getIpkScale(ipk: number): number {
  if (ipk >= 3.5) return 5;
  if (ipk >= 3.0) return 4;
  if (ipk >= 2.5) return 3;
  if (ipk >= 2.0) return 2;
  return 1;
}

function getSksScale(sks: number): number {
  if (sks >= 120) return 5;
  if (sks >= 80) return 4;
  if (sks >= 40) return 3;
  if (sks >= 20) return 2;
  return 1;
}

function getCScale(count: number): number {
  if (count === 0) return 5;
  if (count <= 2) return 4;
  if (count <= 4) return 3;
  if (count <= 6) return 2;
  return 1;
}

function getDScale(count: number): number {
  if (count === 0) return 5;
  if (count === 1) return 3;
  if (count === 2) return 2;
  return 1;
}

function getEScale(count: number): number {
  if (count === 0) return 5;
  return 1;
}

// ==========================================
// LANGKAH 2: Konversi Gap ke Bobot Nilai Gap
// ==========================================

const getGapWeight = (gap: number) => {
  if (gap >= 0) return 5.0; // Tidak ada penalti jika melebihi target (overqualified)
  
  switch (gap) {
    case -1: return 4.0;
    case -2: return 3.0;
    case -3: return 2.0;
    case -4: return 1.0;
    default: return 1.0;
  }
};

export interface PMBreakdown {
  // Langkah 1: Pemetaan Skala
  ipkScale: number;
  sksScale: number;
  cScale: number;
  dScale: number;
  eScale: number;
  // Profil Target
  targetIpkScale: number;
  targetSksScale: number;
  targetCScale: number;
  targetDScale: number;
  targetEScale: number;
  // Langkah 2: Gap = Skala Mahasiswa - Target
  ipkGap: number;
  sksGap: number;
  cGap: number;
  dGap: number;
  eGap: number;
  // Langkah 3: Bobot Nilai Gap (konversi dari gap)
  ipkWeight: number;
  sksWeight: number;
  cWeight: number;
  dWeight: number;
  eWeight: number;
  // Langkah 4: Core Factor & Secondary Factor
  ncf: number;
  nsf: number;
  // Langkah 5: Nilai Total
  totalScore: number;
  status: string;
}

export function calculateProfileMatching(
  student: Student,
  targetProfile = { ipk: 4, sks: 4, c: 5, d: 5, e: 5 } // Default ke profil Smt 5
): { score: number; status: string; breakdown: PMBreakdown } {
  // ==========================================
  // PROFIL TARGET (Standar Ideal Kampus)
  // ==========================================
  const targetIpkScale = targetProfile.ipk;
  const targetSksScale = targetProfile.sks;
  const targetCScale = targetProfile.c;
  const targetDScale = targetProfile.d;
  const targetEScale = targetProfile.e;

  // LANGKAH 1: Pemetaan Nilai Mahasiswa ke Skala (1-5)
  const ipkScale = getIpkScale(student.ipk);
  const sksScale = getSksScale(student.sks_total);
  const cScale = getCScale(student.count_c);
  const dScale = getDScale(student.count_d);
  const eScale = getEScale(student.count_e);

  // LANGKAH 2: Perhitungan Gap (Selisih Skala Mahasiswa - Target)
  const ipkGap = ipkScale - targetIpkScale;
  const sksGap = sksScale - targetSksScale;
  const cGap = cScale - targetCScale;
  const dGap = dScale - targetDScale;
  const eGap = eScale - targetEScale;

  // LANGKAH 3: Konversi Gap ke Bobot Nilai Gap
  const ipkWeight = getGapWeight(ipkGap);
  const sksWeight = getGapWeight(sksGap);
  const cWeight = getGapWeight(cGap);
  const dWeight = getGapWeight(dGap);
  const eWeight = getGapWeight(eGap);

  // LANGKAH 4: Perhitungan Core Factor (NCF) & Secondary Factor (NSF)
  // Core Factor = Kriteria utama (IPK & SKS)
  // Secondary Factor = Kriteria pendukung (Jumlah C, D, E)
  const ncf = (ipkWeight + sksWeight) / 2;
  const nsf = (cWeight + dWeight + eWeight) / 3;

  // LANGKAH 5: Perhitungan Nilai Total
  // Bobot: 60% Core Factor + 40% Secondary Factor
  const totalScore = (0.6 * ncf) + (0.4 * nsf);
  
  // REVISI: Hard Override untuk nilai E atau Total Skor
  let status = 'On-Track';
  if (student.count_e > 0) {
    status = 'Early Warning (Mengulang)'; // Paksa turun status jika ada nilai E
  } else if (totalScore < 4.0) {
    status = 'Early Warning';
  }

  return {
    score: totalScore,
    status,
    breakdown: {
      ipkScale, sksScale, cScale, dScale, eScale,
      targetIpkScale, targetSksScale, targetCScale, targetDScale, targetEScale,
      ipkGap, sksGap, cGap, dGap, eGap,
      ipkWeight, sksWeight, cWeight, dWeight, eWeight,
      ncf, nsf,
      totalScore,
      status,
    }
  };
}

// ==========================================
// PERANKINGAN dengan Profile Matching
// ==========================================
// Mengurutkan berdasarkan Total Score PM (tertinggi = rank 1)
// Tie-breaker jika skor sama:
//   1. NCF (Core Factor) tertinggi
//   2. IPK asli tertinggi
//   3. SKS terbanyak
//   4. Total nilai jelek (C+D+E) paling sedikit

export function rankWithProfileMatching(students: Student[]) {
  if (students.length === 0) return [];

  // Hitung PM breakdown untuk setiap mahasiswa
  const results = students.map(student => {
    const pm = calculateProfileMatching(student);
    return {
      ...student,
      pm_score: pm.score,
      pm_status: pm.status,
      _breakdown: pm.breakdown, // internal, untuk tie-breaking
    };
  });

  // Sorting: Total Score desc -> NCF desc -> IPK desc -> SKS desc -> bad grades asc
  return results.sort((a, b) => {
    // 1. Total Score Profile Matching
    if (b.pm_score !== a.pm_score) return b.pm_score - a.pm_score;

    // 2. NCF (Core Factor) tertinggi
    if (b._breakdown.ncf !== a._breakdown.ncf) return b._breakdown.ncf - a._breakdown.ncf;

    // 3. IPK asli tertinggi
    if (b.ipk !== a.ipk) return b.ipk - a.ipk;

    // 4. SKS terbanyak
    if (b.sks_total !== a.sks_total) return b.sks_total - a.sks_total;

    // 5. Jumlah nilai jelek paling sedikit
    const badA = a.count_c + a.count_d + a.count_e;
    const badB = b.count_c + b.count_d + b.count_e;
    return badA - badB;
  });
}
