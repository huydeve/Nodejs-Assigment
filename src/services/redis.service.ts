import { createClient } from 'redis'

const client = createClient({
    url: 'redis://localhost:6379'
}); // create a Redis client


export async function setResponse(key: string, value: string[]) {

    client.set(key, JSON.stringify(value), {
        EX: 300, NX: true,
    }
    );
}
// Set the OTP in Redis with a TTL of 5 minutes
export async function getResponse(key: string) {
    return await client.get(key)
}

export async function delResponse(key: string) {
    return await client.del(key)
}

export async function delAllResponse() {
    return await client.flushDb()

}
export default client
// Get the OTP from Redis
