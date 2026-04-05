import { useEffect, useState, type ChangeEvent } from 'react'
import { fetchData } from '../api/fetchData'

export function useSearch() {
  const [search, setSearch] = useState('')
  const [data, setData] = useState<string[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetchData(search)
      setData(res.map((x) => x.show.name))
    }
    load()
  }, [search])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return { search, data, handleChange }
}
