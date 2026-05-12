"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  submitInquiry,
  type InquiryState,
} from "@/app/(site)/inquiries/actions";
import {
  siteSecuredOptions,
  timelineOptions,
} from "@/lib/inquiry/schema";
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
        <Field
          name="location"
          label="Location of the site"
          autoComplete="address-level2"
          defaultValue={values?.location}
          error={errors?.location}
        />
      </div>

      <RadioGroup
        name="timeline"
        label="When would you like to start?"
        options={timelineOptions}
        defaultValue={values?.timeline}
      />

      <RadioGroup
        name="siteSecured"
        label="Site secured?"
        options={siteSecuredOptions}
        defaultValue={values?.siteSecured}
      />

      <Textarea
        name="message"
        label="Tell us about the project"
        helper="A few sentences is enough. The land, the brief, what's drawing you to build."
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
          We reply within three working days, always from a person —
          usually one of the founders.
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

const floatLabelClasses = cn(
  "absolute left-4 pointer-events-none origin-left transition-all duration-200 ease-[var(--ease-soft)] select-none",
  // resting state — vertically centered in the input
  "top-1/2 -translate-y-1/2 text-sm text-mute",
  // focused — float up & shrink
  "peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:tracking-[0.18em] peer-focus:uppercase peer-focus:text-ink",
  // filled (placeholder=" " trick) — float up & shrink
  "peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:uppercase",
);

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
  return (
    <div ref={shellRef} className="relative">
      <input
        id={name}
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
        className={cn(
          "peer w-full bg-paper border h-14 px-4 pt-6 pb-1.5 text-base focus:outline-none transition-colors",
          error ? "border-ink" : "border-hairline focus:border-ink",
        )}
      />
      <label htmlFor={name} className={floatLabelClasses}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
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

function RadioGroup({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <fieldset>
      <legend className="eyebrow block mb-3">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="press relative inline-flex items-center cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              defaultChecked={defaultValue === opt.value}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex items-center h-10 px-4 text-sm border border-hairline transition-colors",
                "peer-checked:bg-ink peer-checked:text-cream peer-checked:border-ink",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ink/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper",
                "hover:border-ink",
              )}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Textarea({
  name,
  label,
  helper,
  rows = 5,
  required,
  defaultValue,
  error,
}: FloatProps & {
  helper?: string;
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
      {helper && (
        <p className="-mt-1 mb-2 text-sm text-mute max-w-[60ch]">{helper}</p>
      )}
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
