import * as firebase from 'firebase';

export function snapshotToArray(snapshot) {
	const data = snapshot.val();
	if (data) {
		const uids = Object.keys(data);
		const items = uids.map(uid => Object.assign(data[uid], { uid: uid }));
		return items;
	}
}