import { useExists, useJson } from '@artifact/client/hooks'
import { accountDataSchema, type AccountData } from '../types/account.ts'
import { useEffect, useMemo, useState } from 'react'
import equals from 'fast-deep-equal'

const useAccountData = () => {
  const exists = useExists('profile.json')
  const raw = useJson('profile.json')
  const typedData = useMemo(() => {
    if (raw === undefined) return undefined
    return accountDataSchema.parse(raw)
  }, [raw])
  const [data, setData] = useState<AccountData>()

  useEffect(() => {
    if (equals(data, typedData)) return
    if (typedData) {
      setData(typedData)
    }
  }, [typedData, data])

  const loading = useMemo(
    () => exists === null || (exists && typedData === undefined),
    [exists, typedData]
  )
  const error = exists === false ? 'profile.json not found' : null

  return { data, loading, error }
}

export default useAccountData
