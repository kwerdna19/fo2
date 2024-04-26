import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { cosmeticEquipment, visibleEquipment } from "~/utils/fo";

export async function getMyCollection() {
	const session = await auth();
	if (!session || !session.user) {
		throw new Error("Unauthorized");
	}
	const userId = session.user.id;

	return db.collectionItem.findMany({
		where: {
			userId,
		},
		include: {
			item: {
				select: {
					id: true,
					name: true,
					spriteUrl: true,
					slug: true,
				},
			},
		},
	});
}

export async function addToCollection(data: {
	itemId: string;
	userId: string;
}) {
	return db.collectionItem.upsert({
		where: {
			userId_itemId: data,
		},
		create: data,
		update: {
			addedAt: new Date(),
		},
	});
}

export async function removeFromCollection(data: {
	itemId: string;
	userId: string;
}) {
	return db.collectionItem.delete({
		where: {
			userId_itemId: data,
		},
		include: {
			item: {
				select: {
					name: true,
				},
			},
		},
	});
}

export async function getNumCollectibleItems() {
	return db.item.count({
		where: {
			equip: {
				in: [...visibleEquipment, ...cosmeticEquipment],
			},
		},
	});
}
