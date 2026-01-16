// Components
import { FondoPag } from "../../components/common";
import {useAuth} from '../../context/AuthUserContext';
import { Footer } from "../../layouts";
import {
  HelpSection,
  HomeHeader,
  LineStatus,
  QuickActions,
  ServicesGrid,
  TravelPlanner,
  UserInfo,
} from "../../components/home";

import { useNavigateTo } from "../../hooks";



import "./homescreen.css";

export function HomeScreen() {
  const {user} = useAuth();
  const { goTo } = useNavigateTo();

   return (
    <FondoPag>
      <div className="home-screen">
        <div className="home-main-content">
          <HomeHeader />
          <UserInfo user={user} />
          <QuickActions />
          <ServicesGrid goTo={goTo} />
          <TravelPlanner />
          <LineStatus />
          <HelpSection />
        </div>
        <Footer />
      </div>
    </FondoPag>
  );
}

export default HomeScreen;
