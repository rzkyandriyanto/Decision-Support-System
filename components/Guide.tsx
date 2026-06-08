import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BookOpen, Target, Percent, ArrowRight, AlertTriangle,
  CheckCircle2, Calculator, Info, TrendingUp, Hash
} from "lucide-react";

export default function Guide() {
  return (
    <div className="p-8 font-sans selection:bg-zinc-800">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Guide Aturan SPK</h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
            Dokumentasi lengkap algoritma Profile Matching yang digunakan sistem ini — mulai dari pemetaan skala,
            perhitungan gap, konversi bobot, hingga penentuan status kelulusan.
          </p>
        </div>

        {/* ─── SECTION 1: Gambaran Umum ─── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Info className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Gambaran Umum Metode</h2>
          </div>
          <Card className="bg-black border-zinc-800">
            <CardContent className="pt-5">
              <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                <strong className="text-white">Profile Matching</strong> adalah metode SPK yang membandingkan
                profil akademik mahasiswa dengan profil target ideal. Semakin kecil selisih (gap) antara
                keduanya, semakin tinggi potensi mahasiswa tersebut lulus tepat waktu.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap text-xs font-mono">
                {[
                  { step: "1", label: "Pemetaan Skala", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
                  { step: "→", label: "", color: "text-zinc-600", noBox: true },
                  { step: "2", label: "Hitung Gap", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
                  { step: "→", label: "", color: "text-zinc-600", noBox: true },
                  { step: "3", label: "Bobot Gap", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
                  { step: "→", label: "", color: "text-zinc-600", noBox: true },
                  { step: "4", label: "NCF & NSF", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                  { step: "→", label: "", color: "text-zinc-600", noBox: true },
                  { step: "5", label: "Total Score", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                ].map((s, i) =>
                  s.noBox ? (
                    <ArrowRight key={i} className="w-3 h-3 text-zinc-600 hidden sm:block" />
                  ) : (
                    <div key={i} className={`px-3 py-1.5 rounded-lg border font-semibold ${s.color}`}>
                      Langkah {s.step}: {s.label}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── SECTION 2: Pemetaan Skala ─── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Langkah 1 — Pemetaan Nilai ke Skala</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Setiap nilai aktual mahasiswa dikonversi ke skala 1–5</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* IPK */}
            <Card className="bg-black border-zinc-800">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" /> IPK
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">Indeks Prestasi Kumulatif</CardDescription>
              </CardHeader>
              <CardContent className="pt-3">
                <table className="w-full text-xs font-mono">
                  <thead><tr className="text-zinc-600 text-[10px]"><th className="text-left pb-1">Rentang</th><th className="text-right pb-1">Skala</th></tr></thead>
                  <tbody className="text-zinc-400 divide-y divide-zinc-900">
                    <tr><td className="py-1.5">≥ 3.5</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">5</span></td></tr>
                    <tr><td className="py-1.5">≥ 3.0</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">4</span></td></tr>
                    <tr><td className="py-1.5">≥ 2.5</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">3</span></td></tr>
                    <tr><td className="py-1.5">≥ 2.0</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">2</span></td></tr>
                    <tr><td className="py-1.5">&lt; 2.0</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">1</span></td></tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* SKS */}
            <Card className="bg-black border-zinc-800">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" /> Total SKS
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">Satuan Kredit Semester yang telah lulus</CardDescription>
              </CardHeader>
              <CardContent className="pt-3">
                <table className="w-full text-xs font-mono">
                  <thead><tr className="text-zinc-600 text-[10px]"><th className="text-left pb-1">Rentang</th><th className="text-right pb-1">Skala</th></tr></thead>
                  <tbody className="text-zinc-400 divide-y divide-zinc-900">
                    <tr><td className="py-1.5">≥ 120</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">5</span></td></tr>
                    <tr><td className="py-1.5">≥ 80</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">4</span></td></tr>
                    <tr><td className="py-1.5">≥ 40</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">3</span></td></tr>
                    <tr><td className="py-1.5">≥ 20</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">2</span></td></tr>
                    <tr><td className="py-1.5">&lt; 20</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">1</span></td></tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Nilai C */}
            <Card className="bg-black border-zinc-800">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-yellow-400" /> Jumlah Nilai C
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">Penalti rendah — nilai kurang memuaskan</CardDescription>
              </CardHeader>
              <CardContent className="pt-3">
                <table className="w-full text-xs font-mono">
                  <thead><tr className="text-zinc-600 text-[10px]"><th className="text-left pb-1">Jumlah</th><th className="text-right pb-1">Skala</th></tr></thead>
                  <tbody className="text-zinc-400 divide-y divide-zinc-900">
                    <tr><td className="py-1.5">0</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">5</span></td></tr>
                    <tr><td className="py-1.5">≤ 2</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">4</span></td></tr>
                    <tr><td className="py-1.5">≤ 4</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">3</span></td></tr>
                    <tr><td className="py-1.5">≤ 6</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">2</span></td></tr>
                    <tr><td className="py-1.5">&gt; 6</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">1</span></td></tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Nilai D */}
            <Card className="bg-black border-zinc-800">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-orange-400" /> Jumlah Nilai D
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">Penalti besar — rawan tidak diakui prasyarat</CardDescription>
              </CardHeader>
              <CardContent className="pt-3">
                <table className="w-full text-xs font-mono">
                  <thead><tr className="text-zinc-600 text-[10px]"><th className="text-left pb-1">Jumlah</th><th className="text-right pb-1">Skala</th></tr></thead>
                  <tbody className="text-zinc-400 divide-y divide-zinc-900">
                    <tr><td className="py-1.5">0</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">5</span></td></tr>
                    <tr><td className="py-1.5">1</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">3</span></td></tr>
                    <tr><td className="py-1.5">2</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">2</span></td></tr>
                    <tr><td className="py-1.5">≥ 3</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">1</span></td></tr>
                  </tbody>
                </table>
                <p className="text-[10px] text-orange-400/70 mt-2 italic">
                  Skala langsung anjlok ke 3 saat D = 1 karena risiko prasyarat.
                </p>
              </CardContent>
            </Card>

            {/* Nilai E */}
            <Card className="bg-black border-red-900/30">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-red-400" /> Jumlah Nilai E
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">Penalti fatal — wajib mengulang mata kuliah</CardDescription>
              </CardHeader>
              <CardContent className="pt-3">
                <table className="w-full text-xs font-mono">
                  <thead><tr className="text-zinc-600 text-[10px]"><th className="text-left pb-1">Jumlah</th><th className="text-right pb-1">Skala</th></tr></thead>
                  <tbody className="text-zinc-400 divide-y divide-zinc-900">
                    <tr><td className="py-1.5">0</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">5</span></td></tr>
                    <tr><td className="py-1.5">≥ 1</td><td className="py-1.5 text-right"><span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">1</span></td></tr>
                  </tbody>
                </table>
                <div className="mt-3 p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-[10px] text-red-400 flex items-start gap-1.5">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>Hard Override: status langsung jadi "Early Warning (Mengulang)" bila ada nilai E, berapapun skor akhirnya.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── SECTION 3: Target Ideal & Gap ─── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <Target className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Langkah 2 — Profil Target & Perhitungan Gap</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Gap = Skala Mahasiswa − Skala Target Ideal</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-black border-zinc-800">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-white">Profil Target Ideal (Default Smt. 5)</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Standar akademik yang harus dipenuhi mahasiswa</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <table className="w-full text-sm">
                  <thead><tr className="text-zinc-500 text-xs"><th className="text-left pb-2 font-medium">Kriteria</th><th className="text-right pb-2 font-medium">Target Skala</th><th className="text-right pb-2 font-medium">Setara Dengan</th></tr></thead>
                  <tbody className="text-zinc-400 divide-y divide-zinc-900 text-xs font-mono">
                    <tr><td className="py-2 font-sans">IPK</td><td className="py-2 text-right text-violet-400 font-bold">4</td><td className="py-2 text-right text-zinc-500">IPK ≥ 3.0</td></tr>
                    <tr><td className="py-2 font-sans">SKS</td><td className="py-2 text-right text-violet-400 font-bold">4</td><td className="py-2 text-right text-zinc-500">SKS ≥ 80</td></tr>
                    <tr><td className="py-2 font-sans">Jumlah C</td><td className="py-2 text-right text-violet-400 font-bold">5</td><td className="py-2 text-right text-zinc-500">C = 0</td></tr>
                    <tr><td className="py-2 font-sans">Jumlah D</td><td className="py-2 text-right text-violet-400 font-bold">5</td><td className="py-2 text-right text-zinc-500">D = 0</td></tr>
                    <tr><td className="py-2 font-sans">Jumlah E</td><td className="py-2 text-right text-violet-400 font-bold">5</td><td className="py-2 text-right text-zinc-500">E = 0</td></tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="bg-black border-zinc-800">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-white">Interpretasi Nilai Gap</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Gap menentukan seberapa jauh dari standar ideal</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {[
                  { gap: "Gap > 0", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Melebihi standar ideal" },
                  { gap: "Gap = 0", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", label: "Tepat sesuai standar" },
                  { gap: "Gap = −1", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", label: "Di bawah 1 tingkat" },
                  { gap: "Gap = −2", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", label: "Di bawah 2 tingkat" },
                  { gap: "Gap ≤ −3", color: "text-red-400 bg-red-500/10 border-red-500/20", label: "Jauh dari standar" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded font-mono font-semibold border ${r.color}`}>{r.gap}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                    <span className="text-zinc-400">{r.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── SECTION 4: Konversi Gap → Bobot ─── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <TrendingUp className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Langkah 3 — Konversi Gap ke Bobot Nilai</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Setiap gap dikonversi ke nilai bobot menggunakan tabel standar</p>
            </div>
          </div>
          <Card className="bg-black border-zinc-800">
            <CardContent className="pt-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-zinc-500 text-xs border-b border-zinc-800">
                      <th className="text-center pb-3 font-medium w-24">Gap</th>
                      <th className="text-center pb-3 font-medium">Bobot</th>
                      <th className="text-left pb-3 font-medium">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs divide-y divide-zinc-900">
                    {[
                      { gap: "≥ 0", weight: "5.0", note: "Memenuhi atau melebihi target — tidak ada penalti", weightColor: "text-emerald-400" },
                      { gap: "−1", weight: "4.0", note: "Di bawah target 1 tingkat — penalti ringan", weightColor: "text-yellow-400" },
                      { gap: "−2", weight: "3.0", note: "Di bawah target 2 tingkat — penalti sedang", weightColor: "text-orange-400" },
                      { gap: "−3", weight: "2.0", note: "Di bawah target 3 tingkat — penalti berat", weightColor: "text-red-400" },
                      { gap: "≤ −4", weight: "1.0", note: "Sangat jauh dari target — penalti maksimal", weightColor: "text-red-500" },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td className="py-3 text-center">
                          <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">{r.gap}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`font-bold text-base ${r.weightColor}`}>{r.weight}</span>
                        </td>
                        <td className="py-3 text-zinc-400 font-sans">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── SECTION 5: NCF, NSF, Total Score ─── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Calculator className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Langkah 4 & 5 — NCF, NSF & Total Score</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Pengelompokan bobot dan formula nilai akhir</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black border-zinc-800">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-amber-400">NCF — Core Factor</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Faktor Utama · Bobot 60%</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-xs text-zinc-400">Kriteria yang paling berpengaruh terhadap kelulusan:</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 font-mono">IPK</span>
                  <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 font-mono">Total SKS</span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/50 font-mono text-xs text-zinc-300">
                  NCF = (W<sub>IPK</sub> + W<sub>SKS</sub>) / 2
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-zinc-800">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-amber-400">NSF — Secondary Factor</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Faktor Pendukung · Bobot 40%</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-xs text-zinc-400">Kriteria pendukung yang memperkuat penilaian:</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-zinc-900 border border-yellow-900/40 rounded text-xs text-yellow-500/80 font-mono">Nilai C</span>
                  <span className="px-2 py-1 bg-zinc-900 border border-orange-900/40 rounded text-xs text-orange-500/80 font-mono">Nilai D</span>
                  <span className="px-2 py-1 bg-zinc-900 border border-red-900/40 rounded text-xs text-red-500/80 font-mono">Nilai E</span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/50 font-mono text-xs text-zinc-300">
                  NSF = (W<sub>C</sub> + W<sub>D</sub> + W<sub>E</sub>) / 3
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-emerald-900/30">
              <CardHeader className="pb-2 border-b border-zinc-800/50">
                <CardTitle className="text-sm text-emerald-400">Total Score</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Nilai akhir penentu status</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/50 font-mono text-xs text-zinc-300 leading-relaxed">
                  Total = (0.6 × NCF) + (0.4 × NSF)
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-zinc-300">Skor <strong className="text-white">≥ 4.0</strong> → <strong className="text-emerald-400">On-Track</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="text-zinc-300">Skor <strong className="text-white">&lt; 4.0</strong> → <strong className="text-red-400">Early Warning</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="text-zinc-300">Ada <strong className="text-red-400">Nilai E</strong> → <strong className="text-red-400">Hard Override</strong></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── SECTION 6: Perankingan ─── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-700/30 rounded-lg border border-zinc-700/50">
              <Percent className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Aturan Perankingan</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Urutan prioritas saat terjadi tie-breaking (skor sama)</p>
            </div>
          </div>
          <Card className="bg-black border-zinc-800">
            <CardContent className="pt-5">
              <div className="space-y-3">
                {[
                  { rank: "1", label: "Total Score PM", detail: "Skor tertinggi mendapat peringkat terbaik", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                  { rank: "2", label: "NCF (Core Factor)", detail: "Jika skor sama, NCF lebih tinggi menang", color: "text-zinc-300 bg-zinc-700/20 border-zinc-700/40" },
                  { rank: "3", label: "IPK Asli", detail: "Jika NCF sama, IPK aktual lebih tinggi menang", color: "text-zinc-300 bg-zinc-700/20 border-zinc-700/40" },
                  { rank: "4", label: "Total SKS", detail: "Jika IPK sama, SKS lebih banyak menang", color: "text-zinc-300 bg-zinc-700/20 border-zinc-700/40" },
                  { rank: "5", label: "Jumlah Nilai Buruk (C+D+E)", detail: "Jika semua sama, mahasiswa dengan lebih sedikit nilai buruk menang", color: "text-zinc-300 bg-zinc-700/20 border-zinc-700/40" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${r.color}`}>{r.rank}</span>
                    <div>
                      <span className="text-sm font-medium text-zinc-200">{r.label}</span>
                      <p className="text-xs text-zinc-500 mt-0.5">{r.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
