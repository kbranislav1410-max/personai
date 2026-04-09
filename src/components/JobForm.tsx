"use client";

import { JobFormData } from "@/types/job";

interface Props {
  formData: JobFormData;
  onChange: (field: keyof JobFormData, value: string) => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const textareaClass = `${inputClass} resize-y`;

export default function JobForm({ formData, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Základné informácie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Názov pozície *</label>
            <input
              type="text"
              className={inputClass}
              value={formData.jobTitle}
              onChange={(e) => onChange("jobTitle", e.target.value)}
              placeholder="napr. Senior Frontend Developer"
            />
          </div>
          <div>
            <label className={labelClass}>Spoločnosť *</label>
            <input
              type="text"
              className={inputClass}
              value={formData.company}
              onChange={(e) => onChange("company", e.target.value)}
              placeholder="napr. TechCorp s.r.o."
            />
          </div>
          <div>
            <label className={labelClass}>Lokalita *</label>
            <input
              type="text"
              className={inputClass}
              value={formData.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="napr. Bratislava / Remote"
            />
          </div>
          <div>
            <label className={labelClass}>Typ pracovného pomeru *</label>
            <select
              className={inputClass}
              value={formData.jobType}
              onChange={(e) => onChange("jobType", e.target.value)}
            >
              <option value="">Vyberte typ</option>
              <option value="Plný úväzok">Plný úväzok</option>
              <option value="Čiastočný úväzok">Čiastočný úväzok</option>
              <option value="Remote">Remote</option>
              <option value="Hybridný">Hybridný</option>
              <option value="Dohoda (DPP/DPČ)">Dohoda (DPP/DPČ)</option>
              <option value="Stáž">Stáž</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Mzdové rozpätie</label>
            <input
              type="text"
              className={inputClass}
              value={formData.salaryRange}
              onChange={(e) => onChange("salaryRange", e.target.value)}
              placeholder="napr. 2 500 – 3 500 € / mesiac"
            />
          </div>
          <div>
            <label className={labelClass}>Oddelenie</label>
            <input
              type="text"
              className={inputClass}
              value={formData.department}
              onChange={(e) => onChange("department", e.target.value)}
              placeholder="napr. Engineering / Marketing"
            />
          </div>
        </div>
      </div>

      {/* Position Details */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Popis pozície
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Popis pracovnej pozície *</label>
            <textarea
              className={textareaClass}
              rows={4}
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Stručný popis pozície a jej úlohy v tíme..."
            />
          </div>
          <div>
            <label className={labelClass}>Zodpovednosti a náplň práce *</label>
            <textarea
              className={textareaClass}
              rows={5}
              value={formData.responsibilities}
              onChange={(e) => onChange("responsibilities", e.target.value)}
              placeholder="Každú zodpovednosť zadajte na nový riadok..."
            />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Požiadavky
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Požiadavky na kandidáta *</label>
            <textarea
              className={textareaClass}
              rows={5}
              value={formData.requirements}
              onChange={(e) => onChange("requirements", e.target.value)}
              placeholder="Každú požiadavku zadajte na nový riadok..."
            />
          </div>
          <div>
            <label className={labelClass}>Výhodou je (nice to have)</label>
            <textarea
              className={textareaClass}
              rows={3}
              value={formData.niceToHave}
              onChange={(e) => onChange("niceToHave", e.target.value)}
              placeholder="Každý bod zadajte na nový riadok..."
            />
          </div>
        </div>
      </div>

      {/* Benefits & Company */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Benefity a spoločnosť
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Benefity a čo ponúkame *</label>
            <textarea
              className={textareaClass}
              rows={4}
              value={formData.benefits}
              onChange={(e) => onChange("benefits", e.target.value)}
              placeholder="Každý benefit zadajte na nový riadok..."
            />
          </div>
          <div>
            <label className={labelClass}>Popis spoločnosti</label>
            <textarea
              className={textareaClass}
              rows={3}
              value={formData.companyDescription}
              onChange={(e) => onChange("companyDescription", e.target.value)}
              placeholder="Krátky popis spoločnosti, kultúry a hodnôt..."
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Kontaktné údaje
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kontaktná osoba</label>
            <input
              type="text"
              className={inputClass}
              value={formData.contactPerson}
              onChange={(e) => onChange("contactPerson", e.target.value)}
              placeholder="napr. Jana Nováková"
            />
          </div>
          <div>
            <label className={labelClass}>Kontaktný email</label>
            <input
              type="email"
              className={inputClass}
              value={formData.contactEmail}
              onChange={(e) => onChange("contactEmail", e.target.value)}
              placeholder="napr. kariera@spolocnost.sk"
            />
          </div>
          <div>
            <label className={labelClass}>Uzávierka prihlášok</label>
            <input
              type="date"
              className={inputClass}
              value={formData.applicationDeadline}
              onChange={(e) => onChange("applicationDeadline", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
