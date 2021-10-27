import { useRouter } from 'next/router'
import ContinueWith from '../../../../components/continuewith';

export default function Home() {
  const router = useRouter()
  const { month, year } = router.query
  return (
    <ContinueWith
      express={"https://express.cuppazee.app/clans/requirements/" + month + "/" + year}
      max={"https://max.cuppazee.app/clan/requirements/" + month + "/" + year}
    />
  );
}
