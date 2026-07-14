// NUI -> client köprüsü (CEF içinde fetch ile client callback tetikler)
export async function fetchNui<TResp = unknown, TReq = unknown>(
  callback: string,
  data?: TReq,
): Promise<TResp> {
  const resourceName =
    typeof (window as any).GetParentResourceName === 'function'
      ? (window as any).GetParentResourceName()
      : 'teke_phone'

  const url = 'https://' + resourceName + '/' + callback
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data ?? {}),
  })

  return (await resp.json()) as TResp
}