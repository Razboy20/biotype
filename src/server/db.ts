import type { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import { serverEnv } from "~/env/server";

// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

export const prisma = new PrismaClient({
  log: serverEnv.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export type ParsedSample = {
  graphs: string[];
};

export type FullUser = User & {
  samples: ParsedSample[];
};

export const userCache = new Map<string, FullUser>();

export async function updateUser(userId: string, variance: number, sample: ParsedSample) {
  // add to cache
  const user = userCache.get(userId);

  if (user) {
    user.samples.push({
      graphs: sample.graphs,
    });
  } else {
    userCache.set(userId, {
      name: userId,
      variance: variance,
      samples: [
        {
          graphs: sample.graphs,
        },
      ],
    });
  }

  const newSampleId = nanoid();
  const userSamples = await prisma.user
    .upsert({
      where: {
        name: userId,
      },
      create: {
        name: userId,
        variance: variance,
        samples: {
          create: {
            id: newSampleId,
          },
        },
      },
      update: {
        variance: variance,
        samples: {
          create: {
            id: newSampleId,
          },
        },
      },
    })
    .samples();

  return prisma.graph.createMany({
    data: sample.graphs.map((g) => ({
      value: g,
      sampleId: newSampleId,
    })),
    skipDuplicates: true,
  });
}

export async function getUser(userId: string): Promise<FullUser | undefined> {
  // check cache
  const cachedUser = userCache.get(userId);

  if (cachedUser) return cachedUser;

  // get from db
  const user = await prisma.user.findUnique({
    where: {
      name: userId,
    },
    include: {
      samples: {
        include: {
          graphs: true,
        },
      },
    },
  });

  if (!user) return;

  const parsedUser = {
    ...user,
    samples: user.samples.map((s) => ({ ...s, graphs: s.graphs.map((g) => g.value) })),
  };

  // add to cache
  userCache.set(userId, parsedUser);

  return parsedUser;
}

async function loadUsers() {
  const users = await prisma.user.findMany({
    include: {
      samples: {
        include: {
          graphs: true,
        },
      },
    },
  });

  for (const user of users) {
    const parsedUser = {
      ...user,
      samples: user.samples.map((s) => ({ ...s, graphs: s.graphs.map((g) => g.value) })),
    };

    userCache.set(user.name, parsedUser);
  }
}

void loadUsers();
