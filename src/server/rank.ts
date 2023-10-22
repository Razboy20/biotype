import { Sample } from "@prisma/client/edge";
import { prisma } from "./db";
import meanDistance from "./meanDistance";

async function rank (sample: Sample): Promise<Map<number, string>> {
    const users = await prisma.user.findMany({
        include: {
            samples: true
        }
    });
    let userMap: Map<number, string> = new Map<number, string>();
    for (const user of users) {
        userMap.set(Math.round((1 - meanDistance(sample, user)) * 100), user.name);
    }
    return userMap;
}
