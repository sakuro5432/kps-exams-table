import "server-only";
import { prisma } from "@/lib/db";

export type ReferenceType = "faculty" | "major" | "department" | "campus";

export type ReferenceData = {
  code: string;
  nameTh: string;
};

export async function getReferenceName(
  type: ReferenceType,
  keyInput: string
): Promise<ReferenceData | null> {
  function makeResponse(code: string, nameTh: string): ReferenceData {
    return { code, nameTh };
  }

  switch (type) {
    case "faculty": {
      const faculty = await prisma.faculty.findUnique({
        where: { facultyCode: keyInput },
      });
      return faculty
        ? makeResponse(faculty.facultyCode, faculty.facultyNameTh)
        : null;
    }

    case "major": {
      const major = await prisma.major.findUnique({
        where: { majorCode: keyInput },
      });
      return major ? makeResponse(major.majorCode, major.majorNameTh) : null;
    }

    case "department": {
      const department = await prisma.department.findUnique({
        where: { departmentCode: keyInput },
      });
      return department
        ? makeResponse(department.departmentCode, department.departmentNameTh)
        : null;
    }

    case "campus": {
      const campus = await prisma.campus.findUnique({
        where: { campusCode: keyInput },
      });
      return campus
        ? makeResponse(campus.campusCode, campus.campusNameTh)
        : null;
    }

    default:
      return null;
  }
}

export async function saveReferenceName(
  type: ReferenceType,
  data: ReferenceData[]
) {
  switch (type) {
    case "faculty":
      await Promise.all(
        data.map((item) =>
          prisma.faculty.upsert({
            where: { facultyCode: item.code },
            update: { facultyNameTh: item.nameTh },
            create: {
              facultyCode: item.code,
              facultyNameTh: item.nameTh,
            },
          })
        )
      );
      break;

    case "major":
      await Promise.all(
        data.map((item) =>
          prisma.major.upsert({
            where: { majorCode: item.code },
            update: { majorNameTh: item.nameTh },
            create: {
              majorCode: item.code,
              majorNameTh: item.nameTh,
            },
          })
        )
      );
      break;

    case "department":
      await Promise.all(
        data.map((item) =>
          prisma.department.upsert({
            where: { departmentCode: item.code },
            update: { departmentNameTh: item.nameTh },
            create: {
              departmentCode: item.code,
              departmentNameTh: item.nameTh,
            },
          })
        )
      );
      break;

    case "campus":
      await Promise.all(
        data.map((item) =>
          prisma.campus.upsert({
            where: { campusCode: item.code },
            update: { campusNameTh: item.nameTh },
            create: {
              campusCode: item.code,
              campusNameTh: item.nameTh,
            },
          })
        )
      );
      break;

    default:
      throw new Error(`Unsupported reference type: ${type}`);
  }
}

export async function referenceProcess(
  items: { type: ReferenceType; data: ReferenceData }[]
): Promise<string | void> {
  try {
    for (const item of items) {
      const { type, data } = item;
      const checker = await getReferenceName(type, data.code);
      if (!checker) {
        await saveReferenceName(type, [data]);
      }
    }
  } catch (error) {
    console.error("Error processing reference:", error);
    // แปลง error เป็นข้อความ string แล้ว return แทน throw
    return error instanceof Error ? error.message : String(error);
  }
}
