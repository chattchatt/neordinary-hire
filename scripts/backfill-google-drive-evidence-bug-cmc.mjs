import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const fileUrl = (fileId) => `https://drive.google.com/file/d/${fileId}/view`

const mimeFromTitle = (title) => {
  const lower = title.toLowerCase()
  if (lower.endsWith('.pdf')) return 'application/pdf'
  if (lower.endsWith('.pptx')) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (lower.endsWith('.md')) return 'text/markdown'
  return null
}

const rows = [
  // 제출자 개인 식별/증명/영수증성 문서는 제외하고, 포트폴리오·과제·프로젝트 산출물만 연결한다.
  { email: 'zyl5209315@gmail.com', title: '팀빌딩_모토:강소연 - 소연.pdf', fileId: '10OrqH9CENfc2TTS6So7wKnMm6YYUpq61', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: 'BUG CMC 기획자 팀빌딩 과제 제출물로 확인된 Drive 자료입니다.', confidence: 'high' },
  { email: 'zyl5209315@gmail.com', title: '2차공통과제_모토:강소연 - 소연.pdf', fileId: '1GJThppGPk5oMJDT0Hm957w-rtKB24HQM', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: 'BUG CMC 공통 과제 제출물로 확인된 Drive 자료입니다.', confidence: 'high' },
  { email: 'zyl5209315@gmail.com', title: '[모토:강소연]Market_Insight_Note - 소연.pdf', fileId: '18636gWtO98POPmZoN8gMiJv5CepfuEPc', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: '시장/문제 탐색 역량을 볼 수 있는 Market Insight Note 제출물입니다.', confidence: 'high' },

  { email: 'solp@delivered.co.kr', title: '부울경_CMC_개발자_정규환 - 정규환.pdf', fileId: '1ysGMXXAO69O8XOVmk5q-vwT7kGssUX3k', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '개발자 포트폴리오/지원 자료로 확인된 Drive 자료입니다.', confidence: 'high' },

  { email: 'amazon7737@gmail.com', title: '김강민_Back-end_Developer - 김강민.pdf', fileId: '1zKyilouct-O2z-V1a5SETbrvrb4DFx5d', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '백엔드 개발자 포지션 역량 확인용 포트폴리오 자료입니다.', confidence: 'high' },
  { email: 'amazon7737@gmail.com', title: '김강민_포트폴리오 - 김강민.pdf', fileId: '1cARKA-Z1c75jueAcrUpYG-6SVGg-JnKW', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '개발 경험과 프로젝트 이력을 볼 수 있는 포트폴리오 자료입니다.', confidence: 'high' },

  { email: 'aqwstn@gmail.com', title: '전진혁_포트폴리오_제출용 - 전진혁.pdf', fileId: '10ERJ4YxHfqVl7o2ThlJcOWTD70P9eIkc', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '개발자 포트폴리오 제출용 자료로 확인된 Drive 자료입니다.', confidence: 'high' },

  { email: 'the41220@gmail.com', title: 'apply - 감경민 (DEOPO).md', fileId: '14oVeCqBpGOiNO2fl5F1LWlP2YHE0FnBu', sourceType: 'application_material', projectName: 'BUG CMC', role: '기획', summary: '지원/참여 맥락을 확인할 수 있는 신청 자료입니다.', confidence: 'high' },
  { email: 'the41220@gmail.com', title: 'Dont_Be_Shy_최종_기획서 - 감경민 (DEOPO).pdf', fileId: '1KqLhGImCp_obvDQoyldqawn5puCcVI2i', sourceType: 'project_artifact', projectName: 'Dont Be Shy', role: '기획', summary: '서비스 기획 산출물로 확인된 최종 기획서 자료입니다.', confidence: 'high' },
  { email: 'the41220@gmail.com', title: 'Dont_Be_Shy_기획서_통합 - 감경민 (DEOPO).pdf', fileId: '1WgWg5R7fN5VLAEGYvOZGPffy7OjqljXC', sourceType: 'project_artifact', projectName: 'Dont Be Shy', role: '기획', summary: '서비스 기획 과정과 구조를 볼 수 있는 통합 기획서 자료입니다.', confidence: 'high' },
  { email: 'the41220@gmail.com', title: 'MIN_carbon - 감경민 (DEOPO).pdf', fileId: '1z9p2g55G4V9PUkzo3HiOA6eddYkRzBsH', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: '기획/시장 탐색 과제 제출물로 확인된 자료입니다.', confidence: 'high' },

  { email: 'juanpark80@gmail.com', title: '포트폴리오_박정환 - 박정환.pdf', fileId: '1IHC5cgXKxyUC1Fp1nwHkBGs64djK3a3_', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '개발 경험과 프로젝트 이력을 볼 수 있는 포트폴리오 자료입니다.', confidence: 'high' },
  { email: 'juanpark80@gmail.com', title: '박정환 MYCE Project Small - Juan Park.pdf', fileId: '1tDiopXKVC7l506M_QNV17XJ4FzEsRcus', sourceType: 'project_artifact', projectName: 'MYCE Project', role: '개발자', summary: '개별 프로젝트 경험을 확인할 수 있는 프로젝트 산출물 자료입니다.', confidence: 'high' },

  { email: 'amy88833@gmail.com', title: 'Web developer - 조윤주.pdf', fileId: '1BahSyCfR96rZ11sS1w3-flQ7CeJoHj_1', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '웹 개발자 역량 확인용 포트폴리오 자료입니다.', confidence: 'high' },
  { email: 'amy88833@gmail.com', title: 'umc_조윤주 - 조윤주/컴퓨터공학전공.pdf', fileId: '1uNjF0jfTvX70BTxFLQODOoVA53-HKj65', sourceType: 'application_material', projectName: 'UMC', role: '개발자', summary: 'UMC 참여/지원 맥락을 확인할 수 있는 자료입니다.', confidence: 'medium' },

  { email: 'kim13175@gmail.com', title: '김범조_포트폴리오 - 김동준.pdf', fileId: '11O7wjs3xl_ikhI2ZQabeTMyosRTCJn0O', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '파일 제목에 김범조 포트폴리오가 포함되어 있으나 제출자 표기가 달라 운영자 확인이 필요한 자료입니다.', confidence: 'low' },

  { email: 'koila@kakao.com', title: '포트폴리오_부울경 CMC 1st 참가자 모집 - 오윤석.pdf', fileId: '1dhe_D7_vjmeL_HGnPpTJuCe6S4wDFwrT', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: 'BUG CMC 1기 참가자 모집용 포트폴리오 자료입니다.', confidence: 'high' },

  { email: 'chaeeun6437@unist.ac.kr', title: '이채은_프로젝트 - 이채은.pdf', fileId: '19Qx6AI5ABrklg6hGl7xA7sg3RC8MB9UD', sourceType: 'project_artifact', projectName: 'BUG CMC', role: '개발자', summary: '개발 프로젝트 경험을 확인할 수 있는 프로젝트 자료입니다.', confidence: 'high' },

  { email: 'rkdlq1535@naver.com', title: '김지환_포트폴리오 - 김지환.pdf', fileId: '1WQAoqN71ztZ6hqhUHEpOtGmBUgIsPlQ2', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '개발 경험과 프로젝트 이력을 볼 수 있는 포트폴리오 자료입니다.', confidence: 'high' },

  { email: 'banglouis@daum.net', title: '방재윤 포트폴리오_compressed - 방재윤.pdf', fileId: '1zy-7G0REAuYFx0DSOu-iAZ8Ur_1p-1Z-', sourceType: 'portfolio', projectName: 'BUG CMC', role: '기획', summary: '기획자 포트폴리오 자료로 확인된 Drive 자료입니다.', confidence: 'high' },
  { email: 'banglouis@daum.net', title: 'class-hub(개발)ppt - 방재윤.pdf', fileId: '1EANzWpEiaXxQ-8_YJCAyk-o_kYN9iIZ7', sourceType: 'project_artifact', projectName: 'CLASS HUB', role: '기획', summary: 'CLASS HUB 프로젝트 개발/기획 공유 자료입니다.', confidence: 'high' },
  { email: 'banglouis@daum.net', title: 'CLASSHUB 기획 - 방재윤.pdf', fileId: '1OL6C2c4aM4OIZaqGmV-VlPHes-kEAOB9', sourceType: 'project_artifact', projectName: 'CLASS HUB', role: '기획', summary: 'CLASS HUB 프로젝트 기획 자료입니다.', confidence: 'high' },
  { email: 'banglouis@daum.net', title: 'CMC 2주차 방재윤 - 방재윤.pdf', fileId: '1MIveMpFsipkm-yxXA23siBphucIwskBg', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: 'BUG CMC 2주차 과제 제출물로 확인된 자료입니다.', confidence: 'high' },
  { email: 'banglouis@daum.net', title: 'Market Insight Note 방재윤 - 방재윤.pdf', fileId: '1HyKVCqk50tITvtejhvn_KP0L5-8o3hc_', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: '시장/문제 탐색 역량을 볼 수 있는 Market Insight Note 제출물입니다.', confidence: 'high' },

  { email: 'rkqls196@naver.com', title: '아이숨 기획 피피티 제출용 - 이가빈.pptx', fileId: '1RXThfP9kd4LuG9tfuZweY6H_HDmblSOQ', sourceType: 'project_artifact', projectName: '아이숨(Ai-Soom)', role: '기획', summary: '아이숨 프로젝트 기획 발표 자료입니다.', confidence: 'high' },
  { email: 'rkqls196@naver.com', title: '아이숨_개발PPT - 이가빈.pdf', fileId: '1rUVl5NzSb_PmSkJ8d124AEiD3oJCJimR', sourceType: 'project_artifact', projectName: '아이숨(Ai-Soom)', role: '기획', summary: '아이숨 프로젝트 개발/기획 공유 자료입니다.', confidence: 'high' },
  { email: 'rkqls196@naver.com', title: '에피로그 상세 기획안 - 이가빈.docx', fileId: '1yvG5GiqA1elQmsCbPyZ8ol3W1YGBqfW0', sourceType: 'project_artifact', projectName: '에피로그', role: '기획', summary: '서비스 상세 기획 역량을 확인할 수 있는 기획안 자료입니다.', confidence: 'high' },
  { email: 'rkqls196@naver.com', title: 'My Persona Notion Page, Project Proposal Draft - 이가빈.pdf', fileId: '1ZetvhI_6X_P36Nq-gUJgW_8nzMsJigsI', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: '페르소나/프로젝트 제안 초안을 확인할 수 있는 과제 자료입니다.', confidence: 'high' },
  { email: 'rkqls196@naver.com', title: 'Market Insight Note - 이가빈.pdf', fileId: '1NEYFHGSMBXXZcJJJuWPa3ysct1EM1ifg', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: '시장/문제 탐색 역량을 볼 수 있는 Market Insight Note 제출물입니다.', confidence: 'high' },
  { email: 'rkqls196@naver.com', title: '이가빈 포트폴리오 - 이가빈.pdf', fileId: '1eAGajPlOpxozjBSICGaGynfdgb45g6Cc', sourceType: 'portfolio', projectName: 'BUG CMC', role: '기획', summary: '기획자 포트폴리오 자료로 확인된 Drive 자료입니다.', confidence: 'high' },

  { email: 'wminsoo1@naver.com', title: '프로젝트 경험 - 우준석.pdf', fileId: '1ekhOxqlqk4eQUMUjmfSLfPgHhq3dnyMo', sourceType: 'project_artifact', projectName: 'BUG CMC', role: '개발자', summary: '개발 프로젝트 경험을 확인할 수 있는 프로젝트 자료입니다.', confidence: 'high' },

  { email: 'yujiseong588@gmail.com', title: '포토폴리오_유지성 - shong Ji.pdf', fileId: '10WyuOpoC-hsTPcziiYwawCCikiyOW4lb', sourceType: 'portfolio', projectName: 'BUG CMC', role: '개발자', summary: '개발자 포트폴리오 자료로 확인된 Drive 자료입니다.', confidence: 'high' },
  { email: 'yujiseong588@gmail.com', title: 'AIQ_최종산출물_개발자 - 소연.pdf', fileId: '1fIh5tDXw5s-0h3jTEVT0zD1pMWYXjDQL', sourceType: 'project_artifact', projectName: 'AIQ', role: '개발자', summary: 'AIQ 프로젝트 최종 개발 산출물 자료입니다.', confidence: 'high' },

  { email: 'changli3915@gmail.com', title: '문창일 지원서 - 문창일.pdf', fileId: '1jNIYe-839zFeD-T5JblWehyqDook7k-M', sourceType: 'application_material', projectName: 'BUG CMC', role: '개발자', summary: 'BUG CMC 지원/참여 맥락을 확인할 수 있는 자료입니다.', confidence: 'high' },
  { email: 'changli3915@gmail.com', title: 'dev - 문창일.pptx', fileId: '1FO-mfgAjyrFW06P1mw0U8htHzUDA135G', sourceType: 'project_artifact', projectName: 'BUG CMC', role: '개발자', summary: '개발 산출물/발표 맥락을 확인할 수 있는 자료입니다.', confidence: 'high' },

  { email: 'a89427989@gmail.com', title: '장우영_프로젝트 경험 - 장우영.pdf', fileId: '1SM2ZBC0Yptn-oNGHfsqlZ0ZTaAEG5FIT', sourceType: 'project_artifact', projectName: 'BUG CMC', role: '기획', summary: '프로젝트 경험을 확인할 수 있는 자료입니다.', confidence: 'high' },
  { email: 'a89427989@gmail.com', title: 'CMC14기Planner_포트폴리오_장우영 - 장우영.pdf', fileId: '1LzSJyJ-u968Y6igFDKESv5WfqYbusDK6', sourceType: 'portfolio', projectName: 'CMC', role: '기획', summary: '기획자 포트폴리오 자료로 확인된 Drive 자료입니다.', confidence: 'high' },
  { email: 'a89427989@gmail.com', title: 'CMC - 장우영.pdf', fileId: '1oqY9Z72N8hIFklEYuTUW-JLEh-jKw1B6', sourceType: 'assignment', projectName: 'CMC', role: '기획', summary: 'CMC 참여/과제 맥락을 확인할 수 있는 자료입니다.', confidence: 'medium' },
  { email: 'a89427989@gmail.com', title: 'Team Hypothesis Report 및 Project Proposal Draft PDF 파일 - 장우영.pdf', fileId: '17zUb7Uo9bNYLfVldTcj-5EsUbYLRShrF', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: '팀 가설 리포트와 프로젝트 제안 초안을 확인할 수 있는 과제 자료입니다.', confidence: 'high' },
  { email: 'a89427989@gmail.com', title: 'Market Insight Note - 장우영.pdf', fileId: '1rLWVkDhWIJr2ZKLoGT5FGKHax_y9-Qac', sourceType: 'assignment', projectName: 'BUG CMC', role: '기획', summary: '시장/문제 탐색 역량을 볼 수 있는 Market Insight Note 제출물입니다.', confidence: 'high' },
]

async function main() {
  let upserted = 0
  let activities = 0
  const missingMembers = []

  for (const row of rows) {
    const member = await prisma.member.findUnique({ where: { email: row.email }, select: { id: true, name: true } })
    if (!member) {
      missingMembers.push(row.email)
      continue
    }

    await prisma.googleDriveEvidence.upsert({
      where: { memberId_fileId: { memberId: member.id, fileId: row.fileId } },
      update: {
        title: row.title,
        url: fileUrl(row.fileId),
        mimeType: mimeFromTitle(row.title),
        sourceType: row.sourceType,
        matchedBy: row.confidence === 'low' ? 'drive-title-partial' : 'drive-search-name',
        matchConfidence: row.confidence,
        projectName: row.projectName,
        role: row.role,
        summary: row.summary,
      },
      create: {
        memberId: member.id,
        fileId: row.fileId,
        title: row.title,
        url: fileUrl(row.fileId),
        mimeType: mimeFromTitle(row.title),
        sourceType: row.sourceType,
        matchedBy: row.confidence === 'low' ? 'drive-title-partial' : 'drive-search-name',
        matchConfidence: row.confidence,
        projectName: row.projectName,
        role: row.role,
        summary: row.summary,
      },
    })
    upserted += 1

    const activitySummary = `Google Drive 증거 연결: ${row.title}`
    const existingActivity = await prisma.memberActivity.findFirst({
      where: { memberId: member.id, source: 'google-drive', type: 'evidence-sync', summary: activitySummary },
      select: { id: true },
    })
    if (!existingActivity) {
      await prisma.memberActivity.create({
        data: {
          memberId: member.id,
          source: 'google-drive',
          type: 'evidence-sync',
          summary: activitySummary,
        },
      })
      activities += 1
    }
  }

  const emails = [...new Set(rows.map((row) => row.email))]
  const members = await prisma.member.findMany({
    where: { email: { in: emails } },
    select: {
      name: true,
      email: true,
      driveEvidence: { select: { title: true, sourceType: true, matchConfidence: true } },
    },
    orderBy: { name: 'asc' },
  })

  console.log(JSON.stringify({
    selectedEvidenceRows: rows.length,
    upserted,
    activitiesCreated: activities,
    missingMembers,
    members: members.map((member) => ({
      name: member.name,
      email: member.email,
      driveEvidenceCount: member.driveEvidence.length,
      lowConfidenceCount: member.driveEvidence.filter((e) => e.matchConfidence === 'low').length,
      titles: member.driveEvidence.map((e) => e.title),
    })),
  }, null, 2))
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
