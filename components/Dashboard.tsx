"use client";

import React, { useState, useRef, useTransition, useMemo } from "react";
import { extractPdfData, saveStudentData } from "@/app/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Student, rankWithProfileMatching, calculateProfileMatching, PMBreakdown } from "@/lib/spk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, Search, ChevronDown, ChevronRight, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Guide from "@/components/Guide";

export default function Dashboard({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const classes = Array.from(new Set(students.map(s => s.class_name))).sort();

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const result = await extractPdfData(formData);
      if (result.success && result.data) {
        setPendingStudents(result.data);
        setShowConfirmDialog(true);
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (error: any) {
      alert("Network or Server error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveStudents = async () => {
    setUploading(true);
    try {
      const result = await saveStudentData(pendingStudents);
      if (result.success) {
        setShowConfirmDialog(false);
        window.location.reload();
      } else {
        alert("Save failed: " + result.error);
      }
    } catch (error: any) {
      alert("Error saving data: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePendingStudentChange = (index: number, field: string, value: string) => {
    const updated = [...pendingStudents];
    updated[index][field] = value;
    setPendingStudents(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  // Filter students based on selected tab, class, and search
  let filteredStudents = students;
  if (activeTab === "class" && selectedClass !== "all") {
    filteredStudents = students.filter(s => s.class_name === selectedClass);
  }
  if (searchQuery) {
    filteredStudents = filteredStudents.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nim.includes(searchQuery)
    );
  }

  const rankedStudents = rankWithProfileMatching(filteredStudents);

  // Pre-compute PM breakdowns for all students (used in expanded row)
  const pmBreakdowns = useMemo(() => {
    const map: Record<string, PMBreakdown> = {};
    for (const s of students) {
      const result = calculateProfileMatching(s);
      map[s.nim] = result.breakdown;
    }
    return map;
  }, [students]);

  const toggleRow = (nim: string) => {
    setExpandedRows(prev => ({ ...prev, [nim]: !prev[nim] }));
  };

  return (
    <div className="p-8 font-sans selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Student Analytics</h1>
            <p className="text-zinc-400 text-sm mt-1">Profile Matching — Sistem Pendukung Keputusan</p>
          </div>

          {/* Upload Area */}
          <div
            className="border border-dashed border-zinc-800 rounded-xl p-4 flex items-center justify-center gap-4 bg-zinc-950 hover:bg-zinc-900 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                handleFileUpload(e.target.files);
                e.target.value = ''; // Reset input so the same file can be selected again
              }}
            />
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            ) : (
              <UploadCloud className="w-5 h-5 text-zinc-400" />
            )}
            <div className="text-sm text-zinc-400">
              <span className="text-white font-medium">Click to upload</span> or drag and drop PDFs
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="global" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-zinc-900 border border-zinc-800 text-zinc-400">
              <TabsTrigger value="global" className="data-[state=active]:bg-black data-[state=active]:text-white">Global Prodi Ranking</TabsTrigger>
              <TabsTrigger value="class" className="data-[state=active]:bg-black data-[state=active]:text-white">Class Ranking</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search NIM or Name..."
                  className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {activeTab === "class" && (
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[140px] bg-zinc-950 border-zinc-800 text-white">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <TabsContent value="global" className="mt-0 outline-none">
            <Card className="bg-black border-zinc-800 overflow-hidden shadow-2xl">
              <Table>
                <TableHeader className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-950/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="w-16 text-center text-zinc-400 font-medium">Rank</TableHead>
                    <TableHead className="text-zinc-400 font-medium">Student</TableHead>
                    <TableHead className="text-zinc-400 font-medium">Class</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">IPK</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">SKS</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">C</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">D</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">E</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">Score</TableHead>
                    <TableHead className="text-center text-zinc-400 font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankedStudents.length === 0 ? (
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableCell colSpan={10} className="h-32 text-center text-zinc-500">
                        No students found. Upload some PDFs to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rankedStudents.map((student, index) => {
                      const isTop3 = index < 3;
                      const isWarning = student.pm_status?.includes("Early Warning");

                      return (
                        <React.Fragment key={student.nim}>
                          <TableRow
                            className={cn(
                              "border-zinc-800 transition-all cursor-pointer hover:bg-zinc-900/50 group",
                              isTop3 && "bg-zinc-900/20",
                              isWarning && "bg-red-950/10 border-red-900/20"
                            )}
                            onClick={() => toggleRow(student.nim)}
                          >
                            <TableCell className="text-center">
                              <span className={cn(
                                "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold",
                                index === 0 ? "bg-yellow-500/20 text-yellow-500 glow-top-3" :
                                  index === 1 ? "bg-zinc-300/20 text-zinc-300 glow-top-3" :
                                    index === 2 ? "bg-amber-700/20 text-amber-500 glow-top-3" :
                                      "text-zinc-500"
                              )}>
                                {index + 1}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-zinc-200">{student.name}</span>
                                <span className="text-xs text-zinc-500">{student.nim}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-zinc-800 text-zinc-400 bg-zinc-950">
                                {student.class_name}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-zinc-300">{student.ipk.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-zinc-400">{student.sks_total}</TableCell>
                            <TableCell className="text-right text-yellow-500/80">{student.count_c}</TableCell>
                            <TableCell className="text-right text-orange-500/80">{student.count_d}</TableCell>
                            <TableCell className="text-right text-red-500/80">{student.count_e}</TableCell>
                            <TableCell className="text-right font-mono text-zinc-300">
                              {student.pm_score?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                isWarning
                                  ? "bg-red-500/10 text-red-500 border-red-500/20 red-pulse"
                                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              )}>
                                {student.pm_status}
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedRows[student.nim] && (
                            <TableRow className="border-zinc-800/50 bg-zinc-950/30 hover:bg-zinc-950/30">
                              <TableCell colSpan={10} className="p-0">
                                <div className="p-5 space-y-5 animate-in slide-in-from-top-2 fade-in duration-300">
                                  {/* Profile Matching Breakdown */}
                                  {pmBreakdowns[student.nim] && (() => {
                                    const b = pmBreakdowns[student.nim];
                                    return (
                                      <div className="space-y-5">
                                        {/* Section Header */}
                                        <div className="flex items-center gap-2.5">
                                          <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                            <Calculator className="w-4 h-4 text-indigo-400" />
                                          </div>
                                          <div>
                                            <h3 className="text-sm font-semibold text-white">Rumus Profile Matching — {student.name}</h3>
                                            <p className="text-xs text-zinc-500">5 langkah perhitungan metode Profile Matching dengan nilai aktual</p>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 1: Pemetaan Skala ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Langkah 1</span>
                                            <span className="text-xs text-zinc-400 ml-2">— Pemetaan Nilai Asli ke Skala (1-5)</span>
                                          </div>
                                          <div className="p-4">
                                            <div className="overflow-x-auto">
                                              <table className="w-full text-sm">
                                                <thead>
                                                  <tr className="text-zinc-500 text-xs">
                                                    <th className="text-left pb-2 font-medium w-24">Kriteria</th>
                                                    <th className="text-center pb-2 font-medium w-20">Nilai Asli</th>
                                                    <th className="text-center pb-2 font-medium w-28">Hasil Skala</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="font-mono text-xs">
                                                  {[
                                                    { label: 'IPK', value: student.ipk.toFixed(2), scale: b.ipkScale, color: 'text-zinc-300' },
                                                    { label: 'SKS', value: String(student.sks_total), scale: b.sksScale, color: 'text-zinc-300' },
                                                    { label: 'Jumlah C', value: String(student.count_c), scale: b.cScale, color: 'text-yellow-500/80' },
                                                    { label: 'Jumlah D', value: String(student.count_d), scale: b.dScale, color: 'text-orange-500/80' },
                                                    { label: 'Jumlah E', value: String(student.count_e), scale: b.eScale, color: 'text-red-500/80' },
                                                  ].map((row, i) => (
                                                    <tr key={i} className="border-t border-zinc-800/40">
                                                      <td className="py-2.5 text-zinc-300 font-sans">{row.label}</td>
                                                      <td className={cn("py-2.5 text-center font-semibold", row.color)}>{row.value}</td>
                                                      <td className="py-2.5 text-center">
                                                        <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">{row.scale}</span>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 2: Perhitungan Gap ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Langkah 2</span>
                                            <span className="text-xs text-zinc-400 ml-2">— Perhitungan Gap (Selisih Profil)</span>
                                          </div>
                                          <div className="p-4">



                                            <div className="overflow-x-auto">
                                              <table className="w-full text-sm">
                                                <thead>
                                                  <tr className="text-zinc-500 text-xs">
                                                    <th className="text-left pb-2 font-medium">Kriteria</th>
                                                    <th className="text-center pb-2 font-medium">Skala Mhs</th>
                                                    <th className="text-center pb-2 font-medium text-zinc-600">−</th>
                                                    <th className="text-center pb-2 font-medium">Target</th>
                                                    <th className="text-center pb-2 font-medium text-zinc-600">=</th>
                                                    <th className="text-center pb-2 font-medium">Gap</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="font-mono text-xs">
                                                  {[
                                                    { label: 'IPK', scale: b.ipkScale, target: b.targetIpkScale, gap: b.ipkGap },
                                                    { label: 'SKS', scale: b.sksScale, target: b.targetSksScale, gap: b.sksGap },
                                                    { label: 'Jumlah C', scale: b.cScale, target: b.targetCScale, gap: b.cGap },
                                                    { label: 'Jumlah D', scale: b.dScale, target: b.targetDScale, gap: b.dGap },
                                                    { label: 'Jumlah E', scale: b.eScale, target: b.targetEScale, gap: b.eGap },
                                                  ].map((row, i) => (
                                                    <tr key={i} className="border-t border-zinc-800/40">
                                                      <td className="py-2.5 text-zinc-300 font-sans">{row.label}</td>
                                                      <td className="py-2.5 text-center text-cyan-400">{row.scale}</td>
                                                      <td className="py-2.5 text-center text-zinc-600">−</td>
                                                      <td className="py-2.5 text-center text-zinc-400">{row.target}</td>
                                                      <td className="py-2.5 text-center text-zinc-600">=</td>
                                                      <td className="py-2.5 text-center">
                                                        <span className={cn(
                                                          "px-2.5 py-1 rounded-md border font-semibold",
                                                          row.gap > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                            row.gap === 0 ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                                                              "bg-red-500/10 text-red-400 border-red-500/20"
                                                        )}>{row.gap > 0 ? `+${row.gap}` : row.gap}</span>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 3: Konversi Gap ke Bobot ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Langkah 3</span>
                                            <span className="text-xs text-zinc-400 ml-2">— Konversi Gap ke Bobot Nilai Gap</span>
                                          </div>
                                          <div className="p-4">
                                            <div className="overflow-x-auto">
                                              <table className="w-full text-sm">
                                                <thead>
                                                  <tr className="text-zinc-500 text-xs">
                                                    <th className="text-left pb-2 font-medium">Kriteria</th>
                                                    <th className="text-center pb-2 font-medium">Gap</th>
                                                    <th className="text-center pb-2 font-medium text-zinc-600">→</th>
                                                    <th className="text-center pb-2 font-medium">Bobot Nilai Gap</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="font-mono text-xs">
                                                  {[
                                                    { label: 'IPK', gap: b.ipkGap, weight: b.ipkWeight },
                                                    { label: 'SKS', gap: b.sksGap, weight: b.sksWeight },
                                                    { label: 'Jumlah C', gap: b.cGap, weight: b.cWeight },
                                                    { label: 'Jumlah D', gap: b.dGap, weight: b.dWeight },
                                                    { label: 'Jumlah E', gap: b.eGap, weight: b.eWeight },
                                                  ].map((row, i) => (
                                                    <tr key={i} className="border-t border-zinc-800/40">
                                                      <td className="py-2.5 text-zinc-300 font-sans">{row.label}</td>
                                                      <td className="py-2.5 text-center">
                                                        <span className={cn(
                                                          "px-2 py-0.5 rounded border text-xs",
                                                          row.gap > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                            row.gap === 0 ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                                                              "bg-red-500/10 text-red-400 border-red-500/20"
                                                        )}>{row.gap > 0 ? `+${row.gap}` : row.gap}</span>
                                                      </td>
                                                      <td className="py-2.5 text-center text-zinc-600">→</td>
                                                      <td className="py-2.5 text-center">
                                                        <span className="px-2.5 py-1 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20 font-semibold">{row.weight}</span>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 4: NCF & NSF ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Langkah 4</span>
                                            <span className="text-xs text-zinc-400 ml-2">— Pengelompokan Core Factor (NCF) & Secondary Factor (NSF)</span>
                                          </div>
                                          <div className="p-4 space-y-4">
                                            <p className="text-xs text-zinc-500">Kriteria dibagi menjadi dua kelompok, lalu dihitung rata-ratanya:</p>
                                            {/* NCF */}
                                            <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-amber-400">NCF (Core Factor)</span>
                                                <span className="text-xs text-zinc-600">— Kriteria Utama: IPK & SKS</span>
                                              </div>
                                              <p className="text-xs text-zinc-500 mb-3">Rata-rata bobot dari kriteria utama yang paling berpengaruh.</p>
                                              <div className="font-mono text-sm text-zinc-300 space-y-1">
                                                <div className="flex flex-wrap items-center gap-1">
                                                  <span className="text-zinc-500">NCF =</span>
                                                  <span className="text-zinc-500">(</span>
                                                  <span className="text-zinc-500">Bobot IPK</span>
                                                  <span className="text-zinc-600"> + </span>
                                                  <span className="text-zinc-500">Bobot SKS</span>
                                                  <span className="text-zinc-500">)</span>
                                                  <span className="text-zinc-600"> / </span>
                                                  <span className="text-zinc-500">2</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-1">
                                                  <span className="text-zinc-500">NCF =</span>
                                                  <span className="text-zinc-500">(</span>
                                                  <span className="text-pink-400 font-semibold">{b.ipkWeight}</span>
                                                  <span className="text-zinc-600"> + </span>
                                                  <span className="text-pink-400 font-semibold">{b.sksWeight}</span>
                                                  <span className="text-zinc-500">)</span>
                                                  <span className="text-zinc-600"> / </span>
                                                  <span className="text-zinc-500">2</span>
                                                  <span className="text-zinc-600"> = </span>
                                                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">{b.ncf.toFixed(2)}</span>
                                                </div>
                                              </div>
                                            </div>
                                            {/* NSF */}
                                            <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-amber-400">NSF (Secondary Factor)</span>
                                                <span className="text-xs text-zinc-600">— Kriteria Pendukung: Jumlah C, D, E</span>
                                              </div>
                                              <p className="text-xs text-zinc-500 mb-3">Rata-rata bobot dari kriteria pendukung sebagai pelengkap penilaian.</p>
                                              <div className="font-mono text-sm text-zinc-300 space-y-1">
                                                <div className="flex flex-wrap items-center gap-1">
                                                  <span className="text-zinc-500">NSF =</span>
                                                  <span className="text-zinc-500">(</span>
                                                  <span className="text-zinc-500">Bobot C</span>
                                                  <span className="text-zinc-600"> + </span>
                                                  <span className="text-zinc-500">Bobot D</span>
                                                  <span className="text-zinc-600"> + </span>
                                                  <span className="text-zinc-500">Bobot E</span>
                                                  <span className="text-zinc-500">)</span>
                                                  <span className="text-zinc-600"> / </span>
                                                  <span className="text-zinc-500">3</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-1">
                                                  <span className="text-zinc-500">NSF =</span>
                                                  <span className="text-zinc-500">(</span>
                                                  <span className="text-pink-400 font-semibold">{b.cWeight}</span>
                                                  <span className="text-zinc-600"> + </span>
                                                  <span className="text-pink-400 font-semibold">{b.dWeight}</span>
                                                  <span className="text-zinc-600"> + </span>
                                                  <span className="text-pink-400 font-semibold">{b.eWeight}</span>
                                                  <span className="text-zinc-500">)</span>
                                                  <span className="text-zinc-600"> / </span>
                                                  <span className="text-zinc-500">3</span>
                                                  <span className="text-zinc-600"> = </span>
                                                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">{b.nsf.toFixed(2)}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 5: Total Score ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Langkah 5</span>
                                            <span className="text-xs text-zinc-400 ml-2">— Perhitungan Nilai Total Profile Matching</span>
                                          </div>
                                          <div className="p-4">
                                            <p className="text-xs text-zinc-500 mb-3">Nilai total dihitung dengan bobot 60% Core Factor + 40% Secondary Factor:</p>
                                            <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50 space-y-3">
                                              {/* Rumus umum */}
                                              <div className="font-mono text-sm text-zinc-300 flex flex-wrap items-center gap-1">
                                                <span className="text-zinc-500">Total =</span>
                                                <span className="text-zinc-500">(</span>
                                                <span className="text-zinc-400">60%</span>
                                                <span className="text-zinc-600"> × </span>
                                                <span className="text-zinc-500">NCF</span>
                                                <span className="text-zinc-500">)</span>
                                                <span className="text-zinc-600"> + </span>
                                                <span className="text-zinc-500">(</span>
                                                <span className="text-zinc-400">40%</span>
                                                <span className="text-zinc-600"> × </span>
                                                <span className="text-zinc-500">NSF</span>
                                                <span className="text-zinc-500">)</span>
                                              </div>
                                              {/* Substitusi nilai */}
                                              <div className="font-mono text-sm text-zinc-300 flex flex-wrap items-center gap-1">
                                                <span className="text-zinc-500">Total =</span>
                                                <span className="text-zinc-500">(</span>
                                                <span className="text-zinc-400">0.6</span>
                                                <span className="text-zinc-600"> × </span>
                                                <span className="text-amber-400 font-semibold">{b.ncf.toFixed(2)}</span>
                                                <span className="text-zinc-500">)</span>
                                                <span className="text-zinc-600"> + </span>
                                                <span className="text-zinc-500">(</span>
                                                <span className="text-zinc-400">0.4</span>
                                                <span className="text-zinc-600"> × </span>
                                                <span className="text-amber-400 font-semibold">{b.nsf.toFixed(2)}</span>
                                                <span className="text-zinc-500">)</span>
                                              </div>
                                              {/* Hasil perkalian */}
                                              <div className="font-mono text-sm text-zinc-300 flex flex-wrap items-center gap-1">
                                                <span className="text-zinc-500">Total =</span>
                                                <span className="text-cyan-400">{(0.6 * b.ncf).toFixed(2)}</span>
                                                <span className="text-zinc-600"> + </span>
                                                <span className="text-cyan-400">{(0.4 * b.nsf).toFixed(2)}</span>
                                              </div>
                                              {/* Hasil akhir */}
                                              <div className="font-mono text-sm text-zinc-300 flex flex-wrap items-center gap-1 pt-2 border-t border-zinc-800/50">
                                                <span className="text-zinc-400 font-semibold">Total =</span>
                                                <span className={cn(
                                                  "px-3 py-1.5 rounded-lg font-bold text-base border",
                                                  b.totalScore >= 4.0
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                                )}>
                                                  {b.totalScore.toFixed(2)}
                                                </span>
                                              </div>
                                              {/* Kesimpulan Status */}
                                              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/50">
                                                <span className="text-xs text-zinc-500">Kesimpulan: Skor {b.totalScore.toFixed(2)} {b.totalScore >= 4.0 ? '≥' : '<'} 4.0 →</span>
                                                <span className={cn(
                                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                  b.status?.includes('Early Warning')
                                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                )}>
                                                  {b.status}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Bad Grades Section */}
                                        {student.bad_grades && student.bad_grades.length > 0 && (
                                          <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                            <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Detail</span>
                                              <span className="text-xs text-zinc-400 ml-2">— Daftar Mata Kuliah dengan Nilai C, D, E</span>
                                            </div>
                                            <div className="p-4">
                                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {student.bad_grades.map((bg, bgIdx) => (
                                                  <div key={bgIdx} className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/60">
                                                    <span className="text-sm text-zinc-300 truncate pr-3">{bg.course}</span>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                      <span className="text-xs text-zinc-500 font-mono">{bg.sks} SKS</span>
                                                      <Badge variant="outline" className={cn(
                                                        "h-6 px-2 font-mono",
                                                        bg.grade === 'E' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                                                          bg.grade === 'D' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                                                            'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                                                      )}>
                                                        {bg.grade}
                                                      </Badge>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="class" className="mt-0 outline-none">
            <Card className="bg-black border-zinc-800 overflow-hidden shadow-2xl">
              <Table>
                <TableHeader className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-950/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="w-16 text-center text-zinc-400 font-medium">Rank</TableHead>
                    <TableHead className="text-zinc-400 font-medium">Student</TableHead>
                    <TableHead className="text-zinc-400 font-medium">Class</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">IPK</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">SKS</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">C</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">D</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">E</TableHead>
                    <TableHead className="text-right text-zinc-400 font-medium">Score</TableHead>
                    <TableHead className="text-center text-zinc-400 font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankedStudents.length === 0 ? (
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableCell colSpan={10} className="h-32 text-center text-zinc-500">
                        No students found. Upload some PDFs to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rankedStudents.map((student, index) => {
                      const isTop3 = index < 3;
                      const isWarning = student.pm_status?.includes("Early Warning");

                      return (
                        <React.Fragment key={student.nim}>
                          <TableRow
                            className={cn(
                              "border-zinc-800 transition-all cursor-pointer hover:bg-zinc-900/50 group",
                              isTop3 && "bg-zinc-900/20",
                              isWarning && "bg-red-950/10 border-red-900/20"
                            )}
                            onClick={() => toggleRow(student.nim)}
                          >
                            <TableCell className="text-center">
                              <span className={cn(
                                "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold",
                                index === 0 ? "bg-yellow-500/20 text-yellow-500 glow-top-3" :
                                  index === 1 ? "bg-zinc-300/20 text-zinc-300 glow-top-3" :
                                    index === 2 ? "bg-amber-700/20 text-amber-500 glow-top-3" :
                                      "text-zinc-500"
                              )}>
                                {index + 1}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-zinc-200">{student.name}</span>
                                <span className="text-xs text-zinc-500">{student.nim}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-zinc-800 text-zinc-400 bg-zinc-950">
                                {student.class_name}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-zinc-300">{student.ipk.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-zinc-400">{student.sks_total}</TableCell>
                            <TableCell className="text-right text-yellow-500/80">{student.count_c}</TableCell>
                            <TableCell className="text-right text-orange-500/80">{student.count_d}</TableCell>
                            <TableCell className="text-right text-red-500/80">{student.count_e}</TableCell>
                            <TableCell className="text-right font-mono text-zinc-300">
                              {student.pm_score?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                isWarning
                                  ? "bg-red-500/10 text-red-500 border-red-500/20 red-pulse"
                                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              )}>
                                {student.pm_status}
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedRows[student.nim] && (
                            <TableRow className="border-zinc-800/50 bg-zinc-950/30 hover:bg-zinc-950/30">
                              <TableCell colSpan={10} className="p-0">
                                <div className="p-5 space-y-5 animate-in slide-in-from-top-2 fade-in duration-300">
                                  {/* Profile Matching Breakdown */}
                                  {pmBreakdowns[student.nim] && (() => {
                                    const b = pmBreakdowns[student.nim];
                                    return (
                                      <div className="space-y-5">
                                        {/* Section Header */}
                                        <div className="flex items-center gap-2.5">
                                          <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                            <Calculator className="w-4 h-4 text-indigo-400" />
                                          </div>
                                          <div>
                                            <h3 className="text-sm font-semibold text-white">Hasil Profile Matching — {student.name}</h3>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 1: Pemetaan Skala ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">1. Skala</span>
                                          </div>
                                          <div className="p-4">
                                            <div className="overflow-x-auto">
                                              <table className="w-full text-sm">
                                                <thead>
                                                  <tr className="text-zinc-500 text-xs">
                                                    <th className="text-left pb-2 font-medium w-24">Kriteria</th>
                                                    <th className="text-center pb-2 font-medium w-20">Nilai Asli</th>
                                                    <th className="text-center pb-2 font-medium w-28">Hasil Skala</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="font-mono text-xs">
                                                  {[
                                                    { label: 'IPK', value: student.ipk.toFixed(2), scale: b.ipkScale, color: 'text-zinc-300' },
                                                    { label: 'SKS', value: String(student.sks_total), scale: b.sksScale, color: 'text-zinc-300' },
                                                    { label: 'Jumlah C', value: String(student.count_c), scale: b.cScale, color: 'text-yellow-500/80' },
                                                    { label: 'Jumlah D', value: String(student.count_d), scale: b.dScale, color: 'text-orange-500/80' },
                                                    { label: 'Jumlah E', value: String(student.count_e), scale: b.eScale, color: 'text-red-500/80' },
                                                  ].map((row, i) => (
                                                    <tr key={i} className="border-t border-zinc-800/40">
                                                      <td className="py-2.5 text-zinc-300 font-sans">{row.label}</td>
                                                      <td className={cn("py-2.5 text-center font-semibold", row.color)}>{row.value}</td>
                                                      <td className="py-2.5 text-center">
                                                        <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">{row.scale}</span>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 2 & 3: Gap & Bobot ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">2. Gap & Bobot</span>
                                          </div>
                                          <div className="p-4">
                                            <div className="overflow-x-auto">
                                              <table className="w-full text-sm">
                                                <thead>
                                                  <tr className="text-zinc-500 text-xs">
                                                    <th className="text-left pb-2 font-medium">Kriteria</th>
                                                    <th className="text-center pb-2 font-medium">Skala Mhs</th>
                                                    <th className="text-center pb-2 font-medium text-zinc-600">−</th>
                                                    <th className="text-center pb-2 font-medium">Target</th>
                                                    <th className="text-center pb-2 font-medium text-zinc-600">=</th>
                                                    <th className="text-center pb-2 font-medium">Gap</th>
                                                    <th className="text-center pb-2 font-medium text-zinc-600">→</th>
                                                    <th className="text-center pb-2 font-medium">Bobot Nilai Gap</th>
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
                                                      <td className="py-2.5 text-center text-cyan-400">{row.scale}</td>
                                                      <td className="py-2.5 text-center text-zinc-600">−</td>
                                                      <td className="py-2.5 text-center text-zinc-400">{row.target}</td>
                                                      <td className="py-2.5 text-center text-zinc-600">=</td>
                                                      <td className="py-2.5 text-center">
                                                        <span className={cn(
                                                          "px-2.5 py-1 rounded-md border font-semibold",
                                                          row.gap > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                            row.gap === 0 ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                                                              "bg-red-500/10 text-red-400 border-red-500/20"
                                                        )}>{row.gap > 0 ? `+${row.gap}` : row.gap}</span>
                                                      </td>
                                                      <td className="py-2.5 text-center text-zinc-600">→</td>
                                                      <td className="py-2.5 text-center">
                                                        <span className="px-2.5 py-1 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20 font-semibold">{row.weight}</span>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 4: NCF & NSF ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">3. NCF & NSF</span>
                                          </div>
                                          <div className="p-4 space-y-4">
                                            <div className="flex gap-4">
                                              {/* NCF */}
                                              <div className="flex-1 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <span className="text-xs font-bold text-amber-400">NCF (Core Factor)</span>
                                                </div>
                                                <div className="font-mono text-sm text-zinc-300 space-y-1 mt-3">
                                                  <div className="flex flex-wrap items-center gap-1">
                                                    <span className="text-zinc-500">NCF =</span>
                                                    <span className="text-zinc-500">(</span>
                                                    <span className="text-pink-400 font-semibold">{b.ipkWeight}</span>
                                                    <span className="text-zinc-600"> + </span>
                                                    <span className="text-pink-400 font-semibold">{b.sksWeight}</span>
                                                    <span className="text-zinc-500">)</span>
                                                    <span className="text-zinc-600"> / </span>
                                                    <span className="text-zinc-500">2</span>
                                                    <span className="text-zinc-600"> = </span>
                                                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">{b.ncf.toFixed(2)}</span>
                                                  </div>
                                                </div>
                                              </div>
                                              {/* NSF */}
                                              <div className="flex-1 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <span className="text-xs font-bold text-amber-400">NSF (Secondary Factor)</span>
                                                </div>
                                                <div className="font-mono text-sm text-zinc-300 space-y-1 mt-3">
                                                  <div className="flex flex-wrap items-center gap-1">
                                                    <span className="text-zinc-500">NSF =</span>
                                                    <span className="text-zinc-500">(</span>
                                                    <span className="text-pink-400 font-semibold">{b.cWeight}</span>
                                                    <span className="text-zinc-600"> + </span>
                                                    <span className="text-pink-400 font-semibold">{b.dWeight}</span>
                                                    <span className="text-zinc-600"> + </span>
                                                    <span className="text-pink-400 font-semibold">{b.eWeight}</span>
                                                    <span className="text-zinc-500">)</span>
                                                    <span className="text-zinc-600"> / </span>
                                                    <span className="text-zinc-500">3</span>
                                                    <span className="text-zinc-600"> = </span>
                                                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">{b.nsf.toFixed(2)}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ====== LANGKAH 5: Total Score ====== */}
                                        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                          <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">4. Total Score</span>
                                          </div>
                                          <div className="p-4">
                                            <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50 space-y-3">
                                              {/* Substitusi nilai */}
                                              <div className="font-mono text-sm text-zinc-300 flex flex-wrap items-center gap-1">
                                                <span className="text-zinc-500">Total =</span>
                                                <span className="text-zinc-500">(</span>
                                                <span className="text-zinc-400">0.6</span>
                                                <span className="text-zinc-600"> × </span>
                                                <span className="text-amber-400 font-semibold">{b.ncf.toFixed(2)}</span>
                                                <span className="text-zinc-500">)</span>
                                                <span className="text-zinc-600"> + </span>
                                                <span className="text-zinc-500">(</span>
                                                <span className="text-zinc-400">0.4</span>
                                                <span className="text-zinc-600"> × </span>
                                                <span className="text-amber-400 font-semibold">{b.nsf.toFixed(2)}</span>
                                                <span className="text-zinc-500">)</span>
                                              </div>
                                              {/* Hasil perkalian */}
                                              <div className="font-mono text-sm text-zinc-300 flex flex-wrap items-center gap-1">
                                                <span className="text-zinc-500">Total =</span>
                                                <span className="text-cyan-400">{(0.6 * b.ncf).toFixed(2)}</span>
                                                <span className="text-zinc-600"> + </span>
                                                <span className="text-cyan-400">{(0.4 * b.nsf).toFixed(2)}</span>
                                              </div>
                                              {/* Hasil akhir */}
                                              <div className="font-mono text-sm text-zinc-300 flex flex-wrap items-center gap-1 pt-2 border-t border-zinc-800/50">
                                                <span className="text-zinc-400 font-semibold">Total =</span>
                                                <span className={cn(
                                                  "px-3 py-1.5 rounded-lg font-bold text-base border",
                                                  b.totalScore >= 4.0
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                                )}>
                                                  {b.totalScore.toFixed(2)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Bad Grades Section */}
                                        {student.bad_grades && student.bad_grades.length > 0 && (
                                          <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden">
                                            <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60">
                                              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Detail</span>
                                              <span className="text-xs text-zinc-400 ml-2">— Daftar Mata Kuliah dengan Nilai C, D, E</span>
                                            </div>
                                            <div className="p-4">
                                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {student.bad_grades.map((bg, bgIdx) => (
                                                  <div key={bgIdx} className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/60">
                                                    <span className="text-sm text-zinc-300 truncate pr-3">{bg.course}</span>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                      <span className="text-xs text-zinc-500 font-mono">{bg.sks} SKS</span>
                                                      <Badge variant="outline" className={cn(
                                                        "h-6 px-2 font-mono",
                                                        bg.grade === 'E' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                                                          bg.grade === 'D' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                                                            'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                                                      )}>
                                                        {bg.grade}
                                                      </Badge>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Student Data</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {pendingStudents.map((student, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-400 uppercase">NIM</span>
                  <Input
                    value={student.nim}
                    disabled
                    className="h-8 bg-zinc-900 border-zinc-800 text-zinc-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-400 uppercase">Name</span>
                  <Input
                    value={student.name}
                    onChange={(e) => handlePendingStudentChange(idx, "name", e.target.value)}
                    className="h-8 bg-black border-zinc-800 focus-visible:ring-zinc-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-400 uppercase">Class</span>
                  <Input
                    value={student.class_name}
                    onChange={(e) => handlePendingStudentChange(idx, "class_name", e.target.value)}
                    className="h-8 bg-black border-zinc-800 focus-visible:ring-zinc-700"
                    placeholder="e.g. TPLP-029"
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="border-zinc-800 text-zinc-300 hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleSaveStudents} disabled={uploading} className="bg-white text-black hover:bg-zinc-200">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
