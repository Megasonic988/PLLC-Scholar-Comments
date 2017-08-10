export function snapshotToArray(snapshot) {
	const data = snapshot.val();
	if (data) {
		const uids = Object.keys(data);
		const items = uids.map(uid => Object.assign(data[uid], { uid: uid }));
		return items;
	}
}

export function snapshotWithUid(snapshot) {
	const data = snapshot.val();
	if (data) {
		const uid = snapshot.key;
		return Object.assign(data, {uid: uid});
	}
}