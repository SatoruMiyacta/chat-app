import RoomOverview from '@/components/organisms/RoomOverview';
interface RoomLayoutProps {
  children?: React.ReactNode;
}
const RoomLayout = ({ children }: RoomLayoutProps) => {
  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      {!isPcWindow && <div>{children}</div>}
      {isPcWindow && (
        <div className="flex fullWidth">
          <RoomOverview />
          {children}
        </div>
      )}
    </>
  );
};

export default RoomLayout;
