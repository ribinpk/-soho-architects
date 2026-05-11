"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitInquiry,
  type InquiryState,
} from "@/app/(site)/inquiries/actions";
import { projectTypes } from "@/lib/inquiry/schema";
import { cn } from "@/lib/utils";

const initial: InquiryState = { status: "idle" };

export function InquiryForm() {
  const [state, formAction] = useActionState(submitInquiry, initial);

  if (state.status === "success") {
    return (
      <div className="border border-hairline p-8 md:p-12 bg-paper">
        <span className="eyebrow">Sent</span>
        <p className="mt-4 font-serif text-2xl md:text-3xl tracking-tight max-w-[28ch]">
          {state.message}
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const values = state.status === "error" ? state.values : undefined;

  return (
    <form action={formAction} noValidate className="space-y-6">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          name="name"
          label="Name"
          required
          defaultValue={values?.name}
          error={errors?.name}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          required
          defaultValue={values?.email}
          error={errors?.email}
        />
        <Field
          name="phone"
          label="Phone (optional)"
          defaultValue={values?.phone}
          error={errors?.phone}
        />
        <SelectField
          name="projectType"
          label="Project type"
          defaultValue={values?.projectType}
          error={errors?.projectType}
          options={projectTypes}
        />
        <Field
          name="location"
          label="Location"
          defaultValue={values?.location}
          error={errors?.location}
        />
        <Field
          name="budgetRange"
          label="Budget range (optional)"
          defaultValue={values?.budgetRange}
          error={errors?.budgetRange}
        />
      </div>

      <Textarea
        name="message"
        label="Tell us about the project"
        required
        rows={6}
        defaultValue={values?.message}
        error={errors?.message}
      />

      {state.status === "error" && !errors && (
        <p className="text-sm text-ink bg-surface border border-hairline px-4 py-3">
          {state.message}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <SubmitButton />
        <p className="text-xs text-mute">
          We typically reply within a few business days.
        </p>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center h-12 px-7 bg-ink text-cream text-sm tracking-wide hover:bg-ink-soft disabled:opacity-60 disabled:cursor-wait transition-colors"
    >
      {pending ? "Sending…" : "Send inquiry"}
      {!pending && (
        <span aria-hidden="true" className="ml-3">
          →
        </span>
      )}
    </button>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "mt-2 w-full bg-paper border h-11 px-4 text-sm focus:outline-none transition-colors",
          error
            ? "border-ink"
            : "border-hairline focus:border-ink",
        )}
      />
      {error && (
        <span id={`${name}-error`} className="mt-1.5 block text-xs text-ink">
          {error}
        </span>
      )}
    </label>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  error,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-2 w-full bg-paper border h-11 px-4 text-sm focus:outline-none transition-colors capitalize",
          error ? "border-ink" : "border-hairline focus:border-ink",
        )}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="capitalize">
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="mt-1.5 block text-xs text-ink">{error}</span>}
    </label>
  );
}

function Textarea({
  name,
  label,
  rows = 5,
  required,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  rows?: number;
  required?: boolean;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "mt-2 w-full bg-paper border px-4 py-3 text-sm focus:outline-none transition-colors resize-y",
          error ? "border-ink" : "border-hairline focus:border-ink",
        )}
      />
      {error && (
        <span id={`${name}-error`} className="mt-1.5 block text-xs text-ink">
          {error}
        </span>
      )}
    </label>
  );
}
