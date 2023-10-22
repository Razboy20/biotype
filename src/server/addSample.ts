import { prisma } from "./db";
import degreeOfDisorder from "./degreeOfDisorder";
import { makeSample } from "./makeSample";
import { activeSamples } from "./updateActiveSamples";

export async function addSample(uuid: string, userId: string): Promise<boolean> {
  if (userId == "") return false;
  // console.log("userId:", userId);

  const prospectiveSample = activeSamples.get(uuid);

  if (!prospectiveSample) return false;
  const sample = makeSample(prospectiveSample);
  let user = await prisma.user.findUnique({
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

  if (!user) {
    // create user and add sample to user.samples
    user = await prisma.user.create({
      data: {
        name: userId,
        variance: 0,
        samples: {
          create: [],
        },
      },
      include: {
        samples: {
          include: {
            graphs: true,
          },
        },
      },
    });
  }

  const currentVariance = user.variance;
  const sampleCount = user.samples.length;
  const clique = (sampleCount * (sampleCount - 1)) / 2;
  let sum = 0;
  for (const userSample of user.samples) {
    sum += degreeOfDisorder(sample, userSample);
  }
  let newVariance = 0; // value if new sample will be only sample
  if (sampleCount != 0) {
    newVariance = (currentVariance * clique + sum) / (clique + sampleCount);
  }

  await prisma.user.update({
    where: {
      name: userId,
    },
    data: {
      samples: {
        create: [
          {
            graphs: {
              create: prospectiveSample.map((graph) => {
                return {
                  value: graph[1],
                };
              }),
            },
          },
        ],
      },
      variance: newVariance,
    },
  });
  return true;
}
