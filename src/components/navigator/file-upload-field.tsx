"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, Paperclip, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AttachmentValue } from "@/lib/navigator-shared";

type FileUploadFieldProps = {
  label?: string;
  value: AttachmentValue;
  accept?: string;
  onChange: (value: AttachmentValue) => void;
};

export function FileUploadField({
  label = "附件",
  value,
  accept,
  onChange,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as
        | AttachmentValue
        | {
            error?: string;
          };

      if (!response.ok || !("url" in result)) {
        const message = "error" in result ? result.error : undefined;
        throw new Error(message ?? "上传失败");
      }

      onChange({
        url: result.url,
        name: result.name,
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "上传失败");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">支持上传图片、PDF 或常见文档，单个文件不超过 10MB。</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? <LoaderCircle className="animate-spin" /> : <Upload />}
            {isUploading ? "上传中" : "上传附件"}
          </Button>
          {value.url ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange({ url: "", name: "" })}
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>
      </div>

      {value.url ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
          <div className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
            <Paperclip className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">{value.name || value.url}</span>
          </div>
          <a
            href={value.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-600 transition hover:text-slate-900"
          >
            查看
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      ) : null}

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
