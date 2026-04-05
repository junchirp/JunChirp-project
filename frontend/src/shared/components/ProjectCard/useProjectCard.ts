// 'use client';
//
// import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
// import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
// import { AuthInterface } from '@/shared/interfaces/auth.interface';
//
// interface ProjectCardProps {
//   project: ProjectCardInterface;
//   invites: ProjectParticipationInterface[];
//   requests: ProjectParticipationInterface[];
//   user: AuthInterface | null;
// }
//
// function useProjectCard({ project, invites, requests, user }: ProjectCardProps) {
//   const router = useRouter();
//   const { showToast, isActive } = useToast();
//
//   const currentInvite = ...
//   const isInvite = ...
//   const currentRequest = ...
//   const isRequest = ...
//   const isMyProject = ...
//
//   const goProject = () => { ... }
//   const handleAccept = async () => { ... }
//   const sendRequest = async () => { ... }
//   const handleCancelRequest = async () => { ... }
//
//   return {
//     // state
//     isInvite,
//     isRequest,
//     isMyProject,
//     vacantRoles,
//     members,
//
//     // handlers
//     goProject,
//     handleAccept,
//     sendRequest,
//     handleCancelRequest,
//
//     // loading
//     requestLoading,
//     inviteLoading,
//     cancelRequestLoading,
//
//     // banners
//     isInviteBanner,
//     isRequestBanner,
//     openInvitePopup,
//     closeInvitePopup,
//     ...
//   };
// }
