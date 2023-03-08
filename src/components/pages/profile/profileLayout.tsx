import ProfileOverview from '@/components/organisms/ProfileOverview';

interface ProfileLayoutProps {
  children: React.ReactNode;
}
const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <>
      <div className="sp">{children}</div>
      <div className="pc flex">
        <ProfileOverview />
        {children}
      </div>
    </>
  );
};

export default ProfileLayout;
