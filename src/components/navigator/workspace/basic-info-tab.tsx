import { Sparkles, Users } from "lucide-react";

import { FileUploadField } from "@/components/navigator/file-upload-field";
import { Field, SectionCard } from "@/components/navigator/workspace/primitives";
import type { UpdateAttachmentFn, UpdateFieldFn } from "@/components/navigator/workspace/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ethnicityOptions,
  genderOptions,
  highestDegreeOptions,
  maritalStatusOptions,
  politicalStatusOptions,
  type MemberDraft,
} from "@/lib/navigator-shared";

type BasicInfoTabProps = {
  draft: MemberDraft;
  updateField: UpdateFieldFn;
  updateTopLevelAttachment: UpdateAttachmentFn;
};

export function BasicInfoTab({
  draft,
  updateField,
  updateTopLevelAttachment,
}: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="身份与学术画像"
        description="覆盖人事身份、科研方向、导师类型和入校任职信息。"
        icon={<Users className="text-[#0f4c5c]" />}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="工号">
            {draft.id ? (
              <Input value={draft.employeeId} disabled className="bg-slate-100" />
            ) : (
              <Input value={draft.employeeId} onChange={(event) => updateField("employeeId", event.target.value)} />
            )}
          </Field>
          <Field label="所在院系">
            <Input value={draft.department} onChange={(event) => updateField("department", event.target.value)} />
          </Field>
          <Field label="姓名">
            <Input value={draft.name} onChange={(event) => updateField("name", event.target.value)} />
          </Field>
          <Field label="性别">
            <Select value={draft.gender} onValueChange={(value) => updateField("gender", value)}>
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择性别" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="出生年月">
            <Input type="date" value={draft.birthDate} onChange={(event) => updateField("birthDate", event.target.value)} />
          </Field>
          <Field label="民族">
            <Select value={draft.ethnicity} onValueChange={(value) => updateField("ethnicity", value)}>
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择民族" />
              </SelectTrigger>
              <SelectContent>
                {ethnicityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="籍贯">
            <Input value={draft.hometown} onChange={(event) => updateField("hometown", event.target.value)} />
          </Field>
          <Field label="政治面貌">
            <Select value={draft.politicalStatus} onValueChange={(value) => updateField("politicalStatus", value)}>
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择政治面貌" />
              </SelectTrigger>
              <SelectContent>
                {politicalStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="党龄">
            <Input value={draft.partyAge} onChange={(event) => updateField("partyAge", event.target.value)} />
          </Field>
          <Field label="党内职务">
            <Input value={draft.partyRole} onChange={(event) => updateField("partyRole", event.target.value)} />
          </Field>
          <Field label="职称">
            <Input value={draft.academicTitle} onChange={(event) => updateField("academicTitle", event.target.value)} />
          </Field>
          <Field label="导师类型">
            <Input value={draft.mentorType} onChange={(event) => updateField("mentorType", event.target.value)} />
          </Field>
          <Field label="研究方向" className="xl:col-span-2">
            <Input
              value={draft.researchDirection}
              onChange={(event) => updateField("researchDirection", event.target.value)}
            />
          </Field>
          <Field label="参加工作时间">
            <Input type="date" value={draft.workStartDate} onChange={(event) => updateField("workStartDate", event.target.value)} />
          </Field>
          <Field label="入校时间">
            <Input type="date" value={draft.schoolEntryDate} onChange={(event) => updateField("schoolEntryDate", event.target.value)} />
          </Field>
          <Field label="最高学历学位">
            <Select value={draft.highestDegree} onValueChange={(value) => updateField("highestDegree", value)}>
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择学历学位" />
              </SelectTrigger>
              <SelectContent>
                {highestDegreeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="身份证号码" className="xl:col-span-2">
            <Input value={draft.idNumber} onChange={(event) => updateField("idNumber", event.target.value)} />
          </Field>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Field label="个人简历">
            <Textarea
              className="min-h-36"
              value={draft.biography}
              onChange={(event) => updateField("biography", event.target.value)}
            />
          </Field>
          <FileUploadField
            label="成员头像"
            value={draft.avatar}
            accept="image/*"
            onChange={(value) => updateTopLevelAttachment("avatar", value)}
          />
        </div>

        <Field label="入选人才项目情况">
          <Textarea
            className="min-h-28"
            value={draft.talentPrograms}
            onChange={(event) => updateField("talentPrograms", event.target.value)}
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="联系方式与家庭情况"
        description="支持记录联系方式、婚姻家庭、紧急联系人和个人特长。"
        icon={<Sparkles className="text-[#d97757]" />}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="手机号码">
            <Input value={draft.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </Field>
          <Field label="微信">
            <Input value={draft.wechat} onChange={(event) => updateField("wechat", event.target.value)} />
          </Field>
          <Field label="邮箱">
            <Input type="email" value={draft.email} onChange={(event) => updateField("email", event.target.value)} />
          </Field>
          <Field label="婚姻状况">
            <Select value={draft.maritalStatus} onValueChange={(value) => updateField("maritalStatus", value)}>
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择婚姻状况" />
              </SelectTrigger>
              <SelectContent>
                {maritalStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="紧急联系人及联系方式" className="xl:col-span-2">
            <Input
              value={draft.emergencyContact}
              onChange={(event) => updateField("emergencyContact", event.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="配偶及子女情况">
            <Textarea
              className="min-h-28"
              value={draft.spouseChildren}
              onChange={(event) => updateField("spouseChildren", event.target.value)}
            />
          </Field>
          <Field label="特长与爱好">
            <Textarea
              className="min-h-28"
              value={draft.hobbies}
              onChange={(event) => updateField("hobbies", event.target.value)}
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}
