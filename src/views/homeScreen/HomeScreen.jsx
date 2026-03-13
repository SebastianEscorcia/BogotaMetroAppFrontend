// Components
import { FondoPag } from "../../components/common";
import {useAuth} from '../../global/context';
import { Footer } from "../../global/layouts";
import {
  HelpSection,
  HomeHeader,
  LineStatus,
  QuickActions,
  ServicesGrid,
  TravelPlanner,
  UserInfo,
} from "../../components/home";

import { useNavigateTo, useInterrupcionesFeed } from "../../hooks";

import "./homescreen.css";

export function HomeScreen() {
  const {user} = useAuth();
  const { goTo } = useNavigateTo();
  const {
    interrupcionesActivas,
    loading: interrupcionesLoading,
    isWebSocketConnected,
  } = useInterrupcionesFeed();

   return (
    <FondoPag>
      <div className="home-screen">
        <div className="home-main-content">
          <HomeHeader />
          <UserInfo user={user} />
          <QuickActions />
          <ServicesGrid goTo={goTo} />
          <TravelPlanner />
          <LineStatus
            interrupcionesActivas={interrupcionesActivas}
            loading={interrupcionesLoading}
            isWebSocketConnected={isWebSocketConnected}
          />
          <HelpSection />
        </div>
        <Footer />
      </div>
    </FondoPag>
  );
}

export default HomeScreen;
