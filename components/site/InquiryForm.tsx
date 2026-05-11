"use client";

import { useActionState, useEffect, useRef } from "react";
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
          autoComplete="name"
          defaultValue={values?.name}
          error={errors?.name}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          required
          defaultValue={values?.email}
          error={errors?.email}
        />
        <Field
          name="phone"
          label="Phone (optional)"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
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
          autoComplete="address-level2"
          defaultValue={values?.location}
          error={errors?.location}
        />
        <Field
          name="budgetRange"
          label="Budget range (optional)"
          inputMode="text"
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
      className="press inline-flex items-center justify-center h-12 px-7 bg-ink text-cream text-sm tracking-wide hover:bg-ink-soft disabled:opacity-60 disabled:cursor-wait transition-colors"
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

type FloatProps = {
  name: string;
  label: string;
  error?: string;
};

function useShake(error: string | undefined) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!error || !ref.current) return;
    const el = ref.current;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }, [error]);
  return ref;
}

function FloatingLabelShell({
  children,
  label,
  error,
  name,
  hasValue,
  shellRef,
}: {
  children: React.ReactNode;
  label: string;
  error?: string;
  name: string;
  hasValue: boolean;
  shellRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={shellRef} className="relative">
      {children}
      <label
        htmlFor={name}
        className={cn(
          "absolute left-4 pointer-events-none origin-left transition-all duration-200 ease-[var(--ease-soft)]",
          "text-mute select-none",
          hasValue
            ? "top-1.5 text-[10px] tracking-[0.18em] uppercase text-mute"
            : "top-1/2 -translate-y-1/2 text-sm",
          "peer-focus:top-1.5 peer-focus:!translate-y-0 peer-focus:!text-[10px] peer-focus:!tracking-[0.18em] peer-focus:!uppercase peer-focus:!text-ink",
        )}
      >
        {label}
      </label>
      {error && (
        <span
          id={`${name}-error`}
          className="mt-1.5 block text-xs text-ink"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  inputMode,
  autoComplete,
  autoCapitalize,
  spellCheck,
  required,
  defaultValue,
  error,
}: FloatProps & {
  type?: string;
  inputMode?:
    | "text"
    | "search"
    | "email"
    | "tel"
    | "url"
    | "numeric"
    | "decimal"
    | "none";
  autoComplete?: string;
  autoCapitalize?: string;
  spellCheck?: boolean;
  required?: boolean;
  defaultValue?: string;
}) {
  const shellRef = useShake(error);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValueRef = useRef<boolean>(Boolean(defaultValue));

  return (
    <FloatingLabelShell
      label={`${label}${required ? " *" : ""}`}
      error={error}
      name={name}
      hasValue={hasValueRef.current}
      shellRef={shellRef}
    >
      <input
        id={name}
        ref={inputRef}
        type={type}
        name={name}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        placeholder=" "
        onInput={(e) => {
          const has = (e.target as HTMLInputElement).value.length > 0;
          if (has !== hasValueRef.current) {
            hasValueRef.current = has;
            const el = inputRef.current;
            if (el) {
              el.dataset.filled = has ? "1" : "0";
              el.parentElement
                ?.querySelector("label")
                ?.classList.toggle("filled", has);
            }
          }
        }}
        className={cn(
          "peer w-full bg-paper border h-14 px-4 pt-6 pb-1.5 text-base focus:outline-none transition-colors",
          error ? "border-ink" : "border-hairline focus:border-ink",
        )}
      />
    </FloatingLabelShell>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  error,
  options,
}: FloatProps & {
  defaultValue?: string;
  options: readonly string[];
}) {
  const shellRef = useShake(error);
  const hasValue = Boolean(defaultValue);
  return (
    <FloatingLabelShell
      label={label}
      error={error}
      name={name}
      hasValue={true /* selects always show their value */}
      shellRef={shellRef}
    >
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-invalid={Boolean(error)}
        className={cn(
          "peer w-full bg-paper border h-14 px-4 pt-6 pb-1.5 text-base focus:outline-none transition-colors capitalize",
          error ? "border-ink" : "border-hairline focus:border-ink",
        )}
      >
        <option value="">{hasValue ? "" : "Select…"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="capitalize">
            {opt}
          </option>
        ))}
      </select>
    </FloatingLabelShell>
  );
}

function Textarea({
  name,
  label,
  rows = 5,
  required,
  defaultValue,
  error,
}: FloatProps & {
  rows?: number;
  required?: boolean;
  defaultValue?: string;
}) {
  const shellRef = useShake(error);
  return (
    <div ref={shellRef} className="relative">
      <label htmlFor={name} className="eyebrow block mb-2">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "w-full bg-paper border px-4 py-3 text-base focus:outline-none transition-colors resize-y",
          error ? "border-ink" : "border-hairline focus:border-ink",
        )}
      />
      {error && (
        <span
          id={`${name}-error`}
          className="mt-1.5 block text-xs text-ink"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
