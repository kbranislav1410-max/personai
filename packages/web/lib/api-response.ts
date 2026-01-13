import { NextResponse } from 'next/server';

export type ApiResponse<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { ok: true, data },
    { status }
  );
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json<ApiResponse>(
    { ok: false, error },
    { status }
  );
}
