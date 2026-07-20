import { Users } from "lucide-react";

import { Field, SectionCard } from "@/components/navigator/workspace/primitives";
import type { UpdateFieldFn, UpdateListItemFn } from "@/components/navigator/workspace/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  academicTitleOptions,
  contactRoleLabels,
  ethnicityOptions,
  genderOptions,
  highestDegreeOptions,
  maritalStatusOptions,
  mentorTypeOptions,
  politicalStatusOptions,
  workspaceRoleOptions,
  type MemberDraft,
} from "@/lib/navigator-shared";

type BasicInfoTabProps = {
  draft: MemberDraft;
  updateField: UpdateFieldFn;
  updateListItem: UpdateListItemFn;
};

export function BasicInfoTab({
  draft,
  updateField,
  updateListItem,
}: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="基本信息"
        description="覆盖人事身份、科研方向、导师类型和入校任职信息。"
        icon={<Users className="text-[#a6192e]" />}
      >
        <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
          <Field label="工号">
            {draft.id ? (
              <Input value={draft.employeeId} disabled className="bg-slate-100" />
            ) : (
              <Input value={draft.employeeId} onChange={(event) => updateField("employeeId", event.target.value)} />
            )}
          </Field>
          <Field label="姓名">
            <Input value={draft.name} onChange={(event) => updateField("name", event.target.value)} />
          </Field>
          <Field label="所在院系">
            <Input value={draft.department} onChange={(event) => updateField("department", event.target.value)} />
          </Field>
          <Field label="工作站身份">
            <Select value={draft.workspaceRole} onValueChange={(value) => updateField("workspaceRole", value)}>
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择工作站身份" />
              </SelectTrigger>
              <SelectContent>
                {workspaceRoleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Field label="入党时间">
            <Input type="date" value={draft.partyAge} onChange={(event) => updateField("partyAge", event.target.value)} />
          </Field>
          <Field label="职务">
            <Input value={draft.partyRole} onChange={(event) => updateField("partyRole", event.target.value)} />
          </Field>
          <Field label="职称">
            <Select value={draft.academicTitle} onValueChange={(value) => updateField("academicTitle", value)}>
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择职称" />
              </SelectTrigger>
              <SelectContent>
                {academicTitleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="导师类型">
            <Select value={draft.mentorType} onValueChange={(value) => updateField("mentorType", value)}>
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择导师类型" />
              </SelectTrigger>
              <SelectContent>
                {mentorTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="研究方向" className="lg:col-span-2">
            <Input
              value={draft.researchDirection}
              onChange={(event) => updateField("researchDirection", event.target.value)}
            />
          </Field>
          <Field label="参加工作时间">
            <Input type="date" value={draft.workStartDate} onChange={(event) => updateField("workStartDate", event.target.value)} />
          </Field>
          <Field label="社会兼职（政府兼职、企业挂职）" className="lg:col-span-4">
            <Input
              value={draft.socialPartTime}
              onChange={(event) => updateField("socialPartTime", event.target.value)}
            />
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
          <Field label="身份证号码" className="lg:col-span-2">
            <Input value={draft.idNumber} onChange={(event) => updateField("idNumber", event.target.value)} />
          </Field>
        </div>

        <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
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
          <Field label="紧急联系人及联系方式" className="lg:col-span-4">
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

        <Field label="学习与工作经历">
          <Textarea
            className="min-h-36"
            placeholder={"例如：\n2012.09—2016.06  XX大学XX专业，本科\n2016.09—2019.06  XX大学XX专业，硕士研究生\n2019.07—至今  XX单位XX部门，任XX职务"}
            value={draft.biography}
            onChange={(event) => updateField("biography", event.target.value)}
          />
        </Field>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <Field label="入选人才项目情况">
            <Textarea
              className="min-h-28"
              placeholder="例如：国家级青年人才计划、四川省学术技术带头人后备人选"
              value={draft.talentPrograms}
              onChange={(event) => updateField("talentPrograms", event.target.value)}
            />
          </Field>
          <Field label="重点重大项目">
            <Textarea
              className="min-h-28"
              placeholder="例如：国家重点研发计划项目（项目负责人，2025—2028年）"
              value={draft.majorProjects}
              onChange={(event) => updateField("majorProjects", event.target.value)}
            />
          </Field>
          <Field label="人才称号">
            <Textarea
              className="min-h-28"
              placeholder="例如：国家杰出青年科学基金获得者、教育部青年长江学者"
              value={draft.talentTitles}
              onChange={(event) => updateField("talentTitles", event.target.value)}
            />
          </Field>
          <Field label="省部级及以上奖项">
            <Textarea
              className="min-h-28"
              placeholder="例如：省科学技术进步奖一等奖（排名第1，2025年）"
              value={draft.provincialAwards}
              onChange={(event) => updateField("provincialAwards", event.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="三级联系人"
        description="校级联系人、院系联系人和成长导师信息。"
        icon={<Users className="text-[#a6192e]" />}
      >
        <div className="space-y-3">
          {draft.contacts.map((item, index) => (
            <div
              key={item.role}
              className="grid gap-4 rounded-[20px] border border-black/6 bg-white/90 p-4 md:grid-cols-[140px_1fr_1fr_1fr] md:items-end"
            >
              <p className="self-center text-sm font-medium text-slate-900">{contactRoleLabels[item.role]}</p>
              <Field label="姓名">
                <Input
                  value={item.name}
                  onChange={(event) =>
                    updateListItem("contacts", index, (current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="职务职称">
                <Input
                  value={item.title}
                  onChange={(event) =>
                    updateListItem("contacts", index, (current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="人才称号">
                <Input
                  value={item.talentTitle}
                  onChange={(event) =>
                    updateListItem("contacts", index, (current) => ({
                      ...current,
                      talentTitle: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
