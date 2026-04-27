"use client";

import { useFormStatus } from "react-dom";

import styles from "./AdminSaveButton.module.css";

type AdminSaveButtonProps = {
  label?: string;
  formId?: string;
};

export default function AdminSaveButton({
  label = "שמירת שינויים",
  formId,
}: AdminSaveButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" form={formId} className={styles.button} disabled={pending}>
      <span className={styles.dot} aria-hidden="true" />
      {pending ? "שומר..." : label}
    </button>
  );
}
