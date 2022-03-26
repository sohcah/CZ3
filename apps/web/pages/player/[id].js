import { useRouter } from 'next/router'
import ContinueWith from '../../components/continuewith';

export default function Home() {
  const router = useRouter()
  const { id } = router.query
  return (
    <ContinueWith
      express={"https://express.cuppazee.app/player/" + id}
      max={"https://max.cuppazee.app/user/" + id}
    />
  );
}
