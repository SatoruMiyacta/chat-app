interface GroupLayoutProps {
  children: React.ReactNode;
}

const GroupLayout = ({ children }: GroupLayoutProps) => {
  return (
    <>
      <div className="sp">{children}</div>
      <div className="pc flex">{children}</div>
    </>
  );
};

export default GroupLayout;
