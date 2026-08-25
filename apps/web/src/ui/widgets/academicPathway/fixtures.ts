import type { AcademicPathway } from "../../../sanity/queries/careers"

const en = (value: string) => ({ en: value })

export const medicalTranscriptionistPathway: AcademicPathway = {
  status: "draft",
  items: [
    {
      _type: "pathwayStep",
      _key: "mt-hs",
      title: en("High school diploma or equivalent"),
      description: en("Typical starting requirement"),
      kind: "priorEducation",
      requirement: "required"
    },
    {
      _type: "pathwayStep",
      _key: "mt-cert",
      title: en("Diploma or certificate program"),
      description: en("Medical transcription training"),
      kind: "certificate",
      requirement: "required"
    }
  ]
}

export const certifiedNursingAssistantPathway: AcademicPathway = {
  status: "draft",
  items: [
    {
      _type: "pathwayStep",
      _key: "cna-hs",
      title: en("High school diploma or GED"),
      description: en("Helpful but not always required"),
      kind: "priorEducation",
      requirement: "recommended"
    },
    {
      _type: "pathwayStep",
      _key: "cna-program",
      title: en("State-approved CNA training"),
      description: en("4–12 weeks; at least 120 hours including classroom, lab, and supervised clinical experience"),
      kind: "certificate",
      requirement: "required",
      organization: "Virginia Board of Nursing"
    }
  ]
}

export const socialWorkerPathway: AcademicPathway = {
  status: "draft",
  items: [
    {
      _type: "pathwayStep",
      _key: "sw-bs",
      title: en("Bachelor’s degree in social work"),
      description: en("From a CSWE-accredited program, for entry-level positions"),
      kind: "bachelor",
      requirement: "required",
      organization: "Council on Social Work Education"
    },
    {
      _type: "pathwayStep",
      _key: "sw-ms",
      title: en("Master’s degree in social work"),
      description: en("Required for clinical settings; terminal degree for professional practice"),
      kind: "master",
      requirement: "required",
      organization: "Council on Social Work Education"
    },
    {
      _type: "pathwayStep",
      _key: "sw-doc",
      title: en("Doctoral degree"),
      description: en("Research-focused programs also available"),
      kind: "doctoral",
      requirement: "optional"
    }
  ]
}

export const artTherapistPathway: AcademicPathway = {
  status: "draft",
  items: [
    {
      _type: "pathwayStep",
      _key: "at-ms",
      title: en("Master’s degree"),
      description: en("In art therapy, from an accredited program"),
      kind: "master",
      requirement: "required"
    },
    {
      _type: "pathwayChoice",
      _key: "at-choice",
      label: en("Choose one accreditation type"),
      options: [
        {
          _type: "pathwayStep",
          _key: "at-caahep",
          title: en("CAAHEP-accredited program"),
          description: en("Allied health education accreditation"),
          kind: "other",
          requirement: "required",
          organization: "CAAHEP"
        },
        {
          _type: "pathwayStep",
          _key: "at-atcb",
          title: en("ATCB-accredited program"),
          description: en("Art Therapy Credentials Board"),
          kind: "other",
          requirement: "required",
          organization: "ATCB"
        }
      ]
    },
    {
      _type: "pathwayStep",
      _key: "at-clinical",
      title: en("Supervised clinical experience"),
      description: en("Practicum and internship hours"),
      kind: "clinical",
      requirement: "required"
    },
    {
      _type: "pathwayStep",
      _key: "at-atr",
      title: en("ATCB registration (ATR)"),
      description: en("Registered art therapist credential"),
      kind: "credential",
      requirement: "required",
      organization: "ATCB"
    },
    {
      _type: "pathwayStep",
      _key: "at-bc",
      title: en("Board certification (ATR-BC)"),
      description: en("Pass the national certification exam"),
      kind: "exam",
      requirement: "required",
      organization: "ATCB"
    },
    {
      _type: "pathwayStep",
      _key: "at-license",
      title: en("State licensure"),
      description: en("Requirements vary by state"),
      kind: "licensure",
      requirement: "required"
    }
  ]
}

export const opticianPathway: AcademicPathway = {
  status: "draft",
  items: [
    {
      _type: "pathwayChoice",
      _key: "opt-choice",
      label: en("Choose one route"),
      options: [
        {
          _type: "pathwayStep",
          _key: "opt-cert",
          title: en("Certificate"),
          description: en("From an approved opticianry school"),
          kind: "certificate",
          requirement: "required"
        },
        {
          _type: "pathwayStep",
          _key: "opt-aas",
          title: en("Associate’s degree"),
          description: en("From an approved opticianry school"),
          kind: "associate",
          requirement: "required"
        },
        {
          _type: "pathwayStep",
          _key: "opt-apprentice",
          title: en("Apprenticeship"),
          description: en("Three years in a state-registered program"),
          kind: "apprenticeship",
          requirement: "required"
        }
      ]
    },
    {
      _type: "pathwayStep",
      _key: "opt-ojt",
      title: en("On-the-job training"),
      description: en("Available in some settings"),
      kind: "other",
      requirement: "optional"
    }
  ]
}

export const physicianAssistantPathway: AcademicPathway = {
  status: "draft",
  items: [
    {
      _type: "pathwayStep",
      _key: "pa-bs",
      title: en("Bachelor’s degree"),
      description: en("Required for admission into a physician assistant program"),
      kind: "bachelor",
      requirement: "required"
    },
    {
      _type: "pathwayStep",
      _key: "pa-exp",
      title: en("Previous healthcare experience"),
      description: en("Required for admission into a physician assistant program"),
      kind: "clinical",
      requirement: "required"
    },
    {
      _type: "pathwayStep",
      _key: "pa-ms",
      title: en("Master’s degree"),
      description: en("From a program accredited by the Accreditation Review Commission on Education for the Physician Assistant"),
      kind: "master",
      requirement: "required",
      organization: "ARC-PA"
    }
  ]
}

export const doctorOfMedicinePathway: AcademicPathway = {
  status: "draft",
  items: [
    {
      _type: "pathwayStep",
      _key: "md-bs",
      title: en("Bachelor’s degree"),
      description: en("Strong foundation in math and science; MCAT required for admission"),
      kind: "bachelor",
      requirement: "required"
    },
    {
      _type: "pathwayStep",
      _key: "md-exam",
      title: en("MCAT"),
      description: en("Medical College Admission Test"),
      kind: "exam",
      requirement: "required"
    },
    {
      _type: "pathwayStep",
      _key: "md-doc",
      title: en("Doctoral degree (MD)"),
      description: en("From an allopathic medical school accredited by the Liaison Committee on Medical Education"),
      kind: "doctoral",
      requirement: "required",
      organization: "LCME"
    },
    {
      _type: "pathwayStep",
      _key: "md-residency",
      title: en("Residency"),
      description: en("ACGME-accredited program; specialty training requires 3–5 years"),
      kind: "clinical",
      requirement: "required",
      organization: "ACGME"
    }
  ]
}

export const massageTherapistPathway: AcademicPathway = {
  status: "draft",
  items: [
    {
      _type: "pathwayStep",
      _key: "mt-hs",
      title: en("High school diploma or equivalent"),
      kind: "priorEducation",
      requirement: "required"
    },
    {
      _type: "pathwayStep",
      _key: "mt-hours",
      title: en("Massage therapy program"),
      description: en("At least 500 hours from a program approved by the Virginia Board of Nursing"),
      kind: "certificate",
      requirement: "required",
      organization: "Virginia Board of Nursing"
    },
    {
      _type: "pathwayStep",
      _key: "mt-exam",
      title: en("Licensing exam (MBLEx)"),
      description: en("Pass a licensing exam such as the MBLEx"),
      kind: "exam",
      requirement: "required"
    },
    {
      _type: "pathwayStep",
      _key: "mt-license",
      title: en("Virginia licensure"),
      description: en("Required to practice as a massage therapist in Virginia"),
      kind: "licensure",
      requirement: "required"
    }
  ]
}

export const pathwayFixtures: Record<string, AcademicPathway> = {
  "medical-transcriptionist": medicalTranscriptionistPathway,
  "certified-nursing-assistant": certifiedNursingAssistantPathway,
  "social-worker": socialWorkerPathway,
  "art-therapist": artTherapistPathway,
  "optician": opticianPathway,
  "physician-assistant": physicianAssistantPathway,
  "doctor-of-medicine": doctorOfMedicinePathway,
  "massage-therapist": massageTherapistPathway
}
