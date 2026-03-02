import React, { useEffect, useState } from 'react'
import { useAppDispatch } from './useStore'
import { getData } from '../Store/localStorage'
import { logout, userinfo } from '../Store/AuthSlice'
import LoadingSpinner from '../components/LoadingSpinner' // your spinner component

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true) // local loading state

    useEffect(() => {
        const auth = getData()

        if (auth?.userData) {
            dispatch(userinfo(auth.userData))
        } else {
            dispatch(logout())
        }

        const timer = setTimeout(()=>setLoading(false),1000)
        return ()=>clearTimeout(timer)
    }, [dispatch])

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    // Auth check finished, render children
    return <>{children}</>
}