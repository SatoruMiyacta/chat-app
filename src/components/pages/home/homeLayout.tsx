import HomeOverview from '@/components/organisms/HomeOverview';

interface HomeLayoutProps {
  children?: React.ReactNode;
}
const HomeLayout = ({ children }: HomeLayoutProps) => {
  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      {!isPcWindow && <div>{children}</div>}
      {isPcWindow && (
        <div className="flex">
          <HomeOverview />
          {children}
        </div>
      )}
    </>
  );
};

export default HomeLayout;
