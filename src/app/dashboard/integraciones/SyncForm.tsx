"use client";

import { useActionState } from "react";
import type { SyncResult } from "@/lib/dashboard/actions";

const initialState: SyncResult = { ok: true, message: "" };

export function SyncForm({
  action,
  children,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<SyncResult>;
  children?: React.ReactNode;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(async (_prev: SyncResult, formData: FormData) => {
    return action(formData);
  }, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {children}
      <button type="submit" disabled={pending} className="btn-primary w-fit disabled:opacity-50">
        {pending ? "Sincronizando…" : submitLabel}
      </button>
      {state.message && (
        <p className={`text-xs ${state.ok ? "text-emerald-400" : "text-red-400"}`}>{state.message}</p>
      )}
    </form>
  );
}
