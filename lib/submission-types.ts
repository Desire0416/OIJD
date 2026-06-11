export type SchemaField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "date";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
};

export type FormSchema = {
  fields: SchemaField[];
};

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
