/**
 * Resolve the TEXT parsed from the successful response or reject the JSON from the error
 * @param {Response} response - the Response object returned by Fetch
 * @return {Promise<P = unknown>}
 * @throws {Promise<P = unknown>}
 */
export async function handleResponseTextOrJson<P = unknown>(response: Response): Promise<P> {
  let body = await response.text()
  if (response.ok) {
    let results
    try {
      // convert to object if it is a json
      results = JSON.parse(body)
    } catch (e) {
      // it is not a json
      results = body
    }
    return Promise.resolve(results)
  } else {
    let error
    try {
      // convert to object if it is a json
      error = JSON.parse(body)
    } catch (e) {
      // it is not a json
      error = body
    }
    return Promise.reject(error)
  }
}
