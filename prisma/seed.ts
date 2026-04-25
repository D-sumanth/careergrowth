import { PrismaClient, UserRole, WorkshopStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const [admin, consultant, student] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@careergrowthstudio.co.uk" },
      update: {
        passwordHash,
        role: UserRole.ADMIN,
        emailVerifiedAt: new Date(),
      },
      create: {
        name: "Admin User",
        email: "admin@careergrowthstudio.co.uk",
        passwordHash,
        role: UserRole.ADMIN,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "coach@careergrowthstudio.co.uk" },
      update: {
        passwordHash,
        role: UserRole.CONSULTANT,
        emailVerifiedAt: new Date(),
      },
      create: {
        name: "Priya Shah",
        email: "coach@careergrowthstudio.co.uk",
        passwordHash,
        role: UserRole.CONSULTANT,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "student@example.com" },
      update: {
        passwordHash,
        role: UserRole.STUDENT,
        emailVerifiedAt: new Date(),
      },
      create: {
        name: "Arjun Patel",
        email: "student@example.com",
        passwordHash,
        role: UserRole.STUDENT,
        emailVerifiedAt: new Date(),
      },
    }),
  ]);

  const services = [
    {
      title: "One-to-one career guidance",
      shortDescription: "Focused graduate job strategy sessions for international students in the UK.",
      description: "A personal coaching session covering role targeting, application priorities, timelines, and realistic next steps.",
      whoItIsFor: "Students and recent graduates who want structured guidance and accountability.",
      includedItems: ["Career direction review", "Application strategy", "Action plan"],
      durationMinutes: 60,
      pricePence: 8900,
      isFeatured: true,
    },
    {
      title: "CV and resume review",
      shortDescription: "Detailed written and practical feedback tailored to UK employers.",
      description: "Upload your CV and receive annotated improvements, sharper positioning, and clearer achievement framing.",
      whoItIsFor: "Applicants whose CV is not converting into interviews.",
      includedItems: ["Written feedback", "Formatting fixes", "Targeted suggestions"],
      durationMinutes: 0,
      pricePence: 4900,
      isFeatured: true,
    },
    {
      title: "Interview preparation",
      shortDescription: "Mock interview support with UK graduate market context.",
      description: "Practice competency answers, improve delivery, and understand what employers want to hear.",
      whoItIsFor: "Candidates preparing for assessment centres, screening calls, or final-stage interviews.",
      includedItems: ["Mock questions", "Feedback", "Answer frameworks"],
      durationMinutes: 75,
      pricePence: 10900,
      isFeatured: false,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: slugify(service.title, { lower: true, strict: true }) },
      update: {},
      create: {
        ...service,
        slug: slugify(service.title, { lower: true, strict: true }),
      },
    });
  }

  await prisma.workshop.upsert({
    where: { slug: "graduate-job-search-masterclass" },
    update: {},
    create: {
      slug: "graduate-job-search-masterclass",
      title: "Graduate Job Search Masterclass",
      description: "A practical workshop covering the UK graduate recruitment cycle, application positioning, and interview preparation.",
      startsAt: new Date("2026-05-12T18:00:00.000Z"),
      endsAt: new Date("2026-05-12T20:00:00.000Z"),
      seatLimit: 40,
      pricePence: 2900,
      status: WorkshopStatus.PUBLISHED,
      timezone: "Europe/London",
    },
  });

  await prisma.fAQ.createMany({
    data: [
      {
        question: "Do you only work with students in the UK?",
        answer: "The primary focus is students and graduates building careers in the UK, especially international students who need practical market guidance.",
        category: "general",
        sortOrder: 1,
      },
      {
        question: "Can I reschedule a session?",
        answer: "Yes. Sessions can be rescheduled up to 24 hours before the booking start time unless a different rule is configured in admin settings.",
        category: "bookings",
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Neha R.",
        headline: "From uncertainty to interview invites",
        content: "I finally understood how to position my degree and visa situation properly. My CV and LinkedIn started getting responses within weeks.",
        serviceType: "CV Review",
        university: "University of Birmingham",
        currentRole: "Graduate Analyst",
        featured: true,
      },
      {
        name: "Saurabh M.",
        headline: "Clear, honest, practical coaching",
        content: "The advice was direct and realistic. I left every session with clear next steps rather than vague motivation.",
        serviceType: "Career Guidance",
        university: "University of Leeds",
        currentRole: "Operations Graduate",
        featured: true,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.blogPost.createMany({
    data: [
      {
        slug: "uk-graduate-job-market-guide",
        title: "What the UK graduate job market looks like right now",
        excerpt: "A practical guide to timelines, employer expectations, and where international students lose momentum.",
        content: "The UK graduate market rewards clarity, consistency, and targeted applications. Start by narrowing your role family, building evidence-driven CV bullets, and understanding visa conversations early.",
        topic: "Graduate Jobs",
        published: true,
        publishedAt: new Date(),
      },
      {
        slug: "linkedin-profile-for-international-students",
        title: "How to make your LinkedIn profile work harder for you",
        excerpt: "Small changes to headline, About, and featured sections can improve recruiter confidence.",
        content: "Your LinkedIn profile should reinforce the same story your CV is telling. Use a clear headline, an evidence-based About section, and featured items that show initiative.",
        topic: "LinkedIn",
        published: true,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        title: "Your CV review is queued",
        body: "We have received your documents and the review will begin within the next working day.",
      },
      {
        userId: student.id,
        title: "Workshop reminder",
        body: "The Graduate Job Search Masterclass starts tomorrow at 7:00 PM UK time.",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed for:", {
    admin: admin.email,
    consultant: consultant.email,
    student: student.email,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
