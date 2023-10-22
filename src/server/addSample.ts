import { Sample } from "@prisma/client/edge";
import { prisma } from "./db";
import degreeOfDisorder from "./degreeOfDisorder";

export async function addSample(sample: Sample, userId: string) {
    let user = await prisma.user.findUnique({
        where: {
            name: userId
        },
        include: {
            samples: true
        }
    })
    if (!user) {
        // create user and add sample to user.samples
        user = await prisma.user.create({
            data: {
                name: userId,
                variance: 0,
                samples: {
                    create: []
                }
            },
            include: {
                samples: true
            }
        });
    }

    let currentVariance = user.variance;
    let sampleCount = user.samples.length;
    let clique = sampleCount * (sampleCount - 1) / 2;
    let sum = 0;
    for (const userSample of user.samples) {
        sum += degreeOfDisorder(sample,userSample);
    }
    let newVariance = (currentVariance * clique + sum) / (clique + sampleCount);
    await prisma.user.update({
        where: {
            name: userId
        },
        data: {
            samples: {
                connect: {
                    id: sample.id
                }
            },
            variance: newVariance

        }
    })
}
