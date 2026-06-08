"use client";

import { useState } from "react";
import { calculateProfileMatching, Student, PMBreakdown } from "@/lib/spk";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ManualInputPage() {
  const [ipk, setIpk] = useState<string>("3.5");
  const [sks, setSks] = useState<string>("120");
  const [countC, setCountC] = useState<string>("0");
  const [countD, setCountD] = useState<string>("0");
  const [countE, setCountE] = useState<string>("0");

  const mockStudent: Student = {
    nim: "Manual",
    name: "Manual Input",
    class_name: "Manual",
    ipk: parseFloat(ipk) || 0,
    sks_total: parseInt(sks) || 0,
    count_c: parseInt(countC) || 0,
    count_d: parseInt(countD) || 0,
    count_e: parseInt(countE) || 0,
  };

  const result = calculateProfileMatching(mockStudent);
  const b: PMBreakdown = result.breakdown;

  return (
    <div className="p-8 font-sans selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Input Manual</h1>
          <p className="text-zinc-400 text-sm mt-1">Masukkan data akademik secara manual untuk melihat prediksi kelulusan tepat waktu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Input */}
          <Card className="bg-black border-zinc-800 shadow-xl lg:col-span-5 h-fit">
            <CardHeader className="border-b border-zinc-800/50 pb-4">
              <CardTitle className="text-lg text-white">Data Akademik</CardTitle>
              <CardDescription className="text-zinc-400">Isi form berikut untuk menghitung secara realtime</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-zinc-300 text-sm font-medium">Indeks Prestasi Kumulatif (IPK)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="4" 
                  value={ipk}
                  onChange={(e) => setIpk(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-zinc-300 text-sm font-medium">Total SKS Diperoleh</label>
                <Input 
                  type="number" 
                  step="1" 
                  min="0" 
                  value={sks}
                  onChange={(e) => setSks(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-zinc-700"
                />
              </div>
              
              <div className="pt-4 border-t border-zinc-800/50">
                <h4 className="text-sm font-medium text-zinc-400 mb-4">Jumlah Mata Kuliah dengan Nilai Kurang</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-zinc-300 text-sm font-medium">Nilai C</label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={countC}
                      onChange={(e) => setCountC(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-yellow-400 focus-visible:ring-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-zinc-300 text-sm font-medium">Nilai D</label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={countD}
                      onChange={(e) => setCountD(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-orange-400 focus-visible:ring-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-zinc-300 text-sm font-medium">Nilai E</label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={countE}
                      onChange={(e) => setCountE(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-red-400 focus-visible:ring-zinc-700"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Preview */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Final Score Banner */}
            <div className={cn(
              "p-6 rounded-xl border flex flex-col sm:flex-row items-center gap-6",
              !result.status.includes('Early Warning') 
                ? "bg-emerald-500/10 border-emerald-500/20" 
                : "bg-red-500/10 border-red-500/20"
            )}>
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-4",
                !result.status.includes('Early Warning') 
                  ? "bg-emerald-950 border-emerald-500/30 text-emerald-400" 
                  : "bg-red-950 border-red-500/30 text-red-400"
              )}>
                {!result.status.includes('Early Warning') ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-zinc-400 font-medium">Prediksi Kelulusan</h3>
                <div className={cn(
                  "text-3xl font-bold mt-1",
                  !result.status.includes('Early Warning') ? "text-emerald-400" : "text-red-400"
                )}>
                  {result.status}
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  Total Score: <span className="font-mono text-zinc-300">{result.score.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <Card className="bg-black border-zinc-800 shadow-xl">
              <CardHeader className="border-b border-zinc-800/50 pb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-400" />
                  <CardTitle className="text-lg text-white">Rincian Perhitungan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                {/* 1. Skala */}
                <div>
                  <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">1. Pemetaan Skala</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-zinc-500 text-xs">
                          <th className="text-left pb-2 font-medium w-24">Kriteria</th>
                          <th className="text-center pb-2 font-medium w-20">Nilai</th>
                          <th className="text-center pb-2 font-medium w-28">Skala</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-xs">
                        <tr className="border-t border-zinc-800/40">
                          <td className="py-2.5 text-zinc-300 font-sans">IPK</td>
                          <td className="py-2.5 text-center font-semibold text-zinc-300">{mockStudent.ipk.toFixed(2)}</td>
                          <td className="py-2.5 text-center text-cyan-400">{b.ipkScale}</td>
                        </tr>
                        <tr className="border-t border-zinc-800/40">
                          <td className="py-2.5 text-zinc-300 font-sans">SKS</td>
                          <td className="py-2.5 text-center font-semibold text-zinc-300">{mockStudent.sks_total}</td>
                          <td className="py-2.5 text-center text-cyan-400">{b.sksScale}</td>
                        </tr>
                        <tr className="border-t border-zinc-800/40">
                          <td className="py-2.5 text-zinc-300 font-sans">Jumlah C</td>
                          <td className="py-2.5 text-center font-semibold text-yellow-500/80">{mockStudent.count_c}</td>
                          <td className="py-2.5 text-center text-cyan-400">{b.cScale}</td>
                        </tr>
                        <tr className="border-t border-zinc-800/40">
                          <td className="py-2.5 text-zinc-300 font-sans">Jumlah D</td>
                          <td className="py-2.5 text-center font-semibold text-orange-500/80">{mockStudent.count_d}</td>
                          <td className="py-2.5 text-center text-cyan-400">{b.dScale}</td>
                        </tr>
                        <tr className="border-t border-zinc-800/40">
                          <td className="py-2.5 text-zinc-300 font-sans">Jumlah E</td>
                          <td className="py-2.5 text-center font-semibold text-red-500/80">{mockStudent.count_e}</td>
                          <td className="py-2.5 text-center text-cyan-400">{b.eScale}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2 & 3. Gap & Bobot */}
                <div>
                  <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">2. Gap & Bobot</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-zinc-500 text-xs">
                          <th className="text-left pb-2 font-medium">Kriteria</th>
                          <th className="text-center pb-2 font-medium">Skala</th>
                          <th className="text-center pb-2 font-medium">Target</th>
                          <th className="text-center pb-2 font-medium">Gap</th>
                          <th className="text-center pb-2 font-medium">Bobot</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-xs">
                        {[
                          { label: 'IPK', scale: b.ipkScale, target: b.targetIpkScale, gap: b.ipkGap, weight: b.ipkWeight },
                          { label: 'SKS', scale: b.sksScale, target: b.targetSksScale, gap: b.sksGap, weight: b.sksWeight },
                          { label: 'Jumlah C', scale: b.cScale, target: b.targetCScale, gap: b.cGap, weight: b.cWeight },
                          { label: 'Jumlah D', scale: b.dScale, target: b.targetDScale, gap: b.dGap, weight: b.dWeight },
                          { label: 'Jumlah E', scale: b.eScale, target: b.targetEScale, gap: b.eGap, weight: b.eWeight },
                        ].map((row, i) => (
                          <tr key={i} className="border-t border-zinc-800/40">
                            <td className="py-2.5 text-zinc-300 font-sans">{row.label}</td>
                            <td className="py-2.5 text-center text-zinc-400">{row.scale}</td>
                            <td className="py-2.5 text-center text-zinc-500">{row.target}</td>
                            <td className="py-2.5 text-center">
                              <span className={cn(
                                row.gap > 0 ? "text-emerald-400" :
                                row.gap === 0 ? "text-cyan-400" :
                                "text-red-400"
                              )}>{row.gap > 0 ? `+${row.gap}` : row.gap}</span>
                            </td>
                            <td className="py-2.5 text-center text-pink-400 font-semibold">{row.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. NCF & NSF */}
                <div>
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">3. NCF & NSF</h4>
                  <div className="flex gap-4">
                    <div className="flex-1 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                      <span className="text-xs font-bold text-zinc-400 block mb-1">NCF (60%)</span>
                      <span className="font-mono text-amber-400 font-bold">{b.ncf.toFixed(2)}</span>
                    </div>
                    <div className="flex-1 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                      <span className="text-xs font-bold text-zinc-400 block mb-1">NSF (40%)</span>
                      <span className="font-mono text-amber-400 font-bold">{b.nsf.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
