export async function GET({ locals }: { locals: any }) {
	if (!locals.auth().userId) {
		return new Response("Unauthorized", { status: 401 });
	}

	return new Response(JSON.stringify(locals.auth().userId));
}
