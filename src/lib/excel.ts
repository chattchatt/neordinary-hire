import * as XLSX from "xlsx";

export interface TalentData {
  name: string;
  affiliation: string;
  organization: string;
  contact: string;
  role: string;
  techStack: string;
  certifications: string;
  experience: string;
  projectExperience: string;
  availability: string;
  workType: string;
  workRegion: string;
  notes: string;
}

export function exportToExcel(data: TalentData[], filename?: string) {
  const header = [
    "성명",
    "소속 구분",
    "소속 회사명",
    "연락처 / 이메일",
    "주요 역할",
    "기술 스택",
    "보유 자격증",
    "총 경력 (년)",
    "차세대 프로젝트 관련 경력",
    "가용 시기",
    "희망 근무 형태",
    "근무 가능 지역",
    "기타 사항",
  ];

  const rows = data.map((d) => [
    d.name,
    d.affiliation,
    d.organization,
    d.contact,
    d.role,
    d.techStack,
    d.certifications,
    d.experience,
    d.projectExperience,
    d.availability,
    d.workType,
    d.workRegion,
    d.notes,
  ]);

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

  // Column widths
  ws["!cols"] = [
    { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 30 }, { wch: 15 },
    { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 30 }, { wch: 12 },
    { wch: 15 }, { wch: 15 }, { wch: 20 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "인력Pool");

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, filename || `Ne(o)rdinary_인력Pool_${date}.xlsx`);
}