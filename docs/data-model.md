# Product Data Model

This document describes product-level entities. Prisma remains the implementation source for exact fields.

## Member

Talent profile submitted through registration. Includes contact data, role/stack, availability, community context, and evidence relations.

Company-facing views must use a curated/anonymized projection, not the raw `Member` record.

## MemberActivity

Reviewed activity event associated with a member. Intended for internal context and summarized signals.

## DiscordActivityEvidence

Discord/community evidence linked to a member. Raw identifiers and excerpts are private/admin-only by default.

## GoogleDriveEvidence

Project or portfolio evidence linked from Drive. Partner-facing surfaces should use curated summaries and confidence labels only.

## Company

Partner organization record. Access and approval state should determine company-view availability.

## Bookmark

Company-to-member shortlist relationship. This supports partner review workflow without exposing direct talent contact data.

## Source inventory

[`docs/data-source-inventory.md`](data-source-inventory.md)를 기준으로 어떤 원천 데이터가 이 entity에 연결될 수 있는지, 어떤 후보 카드 신호를 지원하는지, 어떤 partner-safe projection이 허용되는지 판단한다.
