import { useUserContext } from '@/context/AuthContext'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutation'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TopBar = () => {
    const navigate = useNavigate()
    const { mutate: signOut, isSuccess } = useSignOutAccount()

    const { user } = useUserContext()

    useEffect(() => {
        if (isSuccess) navigate(0)
    }, [isSuccess])
    return (
        <section className='topbar'>
            <div className='flex-between py-4 px-5'>
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
                </Link>
                <div className='flex gap-4'>
                    <button className='shad-button_ghost' onClick={() => signOut()}>
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </button>

                    <Link to={`/profile/${user.id}`} className="flex-center gap-3 items-center">
                        <img src={user.imageUrl || '/assets/images/profile-placeholder.svg'} alt="logo" className="h-8 w-8 rounded-full" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default TopBar