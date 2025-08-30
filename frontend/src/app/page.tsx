'use client';

import styles from './page.module.scss';
import { ReactElement } from 'react';
import HomeBanner from './components/HomePage/HomeBanner/HomeBanner';
import { useAppSelector } from '../hooks/reduxHooks';
import authSelector from '../redux/auth/authSelector';
import HomeSkeleton from './components/HomePage/HomeSkeleton/HomeSkeleton';
import Quote from './components/HomePage/Quote/Quote';
import ThreeSteps from './components/HomePage/ThreeSteps/ThreeSteps';
import AnimatedBlocks from './components/HomePage/AnimatedBlocks/AnimatedBlocks';
import AnimatedBlocksTwo from './components/HomePage/AnimatedBlocksTwo/AnimatedBlocksTwo';
import AnimatedBlocksThree from './components/HomePage/AnimatedBlocksThree/AnimatedBlocksThree';

export default function Home(): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);

  if (loadingStatus !== 'loaded') {
    return <HomeSkeleton />;
  }

  return (
    <>
      <div className={styles.home}>
        <HomeBanner user={user} />
        <Quote />
        <ThreeSteps />
        <div className={styles.home__3}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
          asperiores consequatur cum deleniti dolore dolores eveniet fugit
          inventore iste iure laudantium nesciunt nobis perferendis quae quia
          quibusdam, quidem quos ut velit, voluptatibus! Accusantium, aliquid
          consequatur dolorem, dolores doloribus, ducimus enim eos est hic in
          ipsum nihil officia perspiciatis possimus quas tenetur vero. A aliquam
          aspernatur atque blanditiis consectetur consequatur culpa debitis
          deserunt dicta doloribus ducimus ea explicabo fugiat fugit harum
          libero minima nesciunt obcaecati, odio officiis pariatur placeat,
          praesentium quas quibusdam quisquam rerum tempore vero voluptatem
          voluptates voluptatibus. Aspernatur dolorem eveniet, impedit in minima
          odit perferendis quod? Aspernatur aut beatae laborum optio
          perferendis, repudiandae? Accusamus aliquam aliquid asperiores
          consectetur cum cumque delectus dolor doloremque enim error est
          excepturi facere fugiat in inventore iusto laboriosam maiores nisi
          numquam odit omnis quam quasi qui, quo recusandae repellendus
          reprehenderit sequi ullam unde voluptatum? A accusantium aliquid at
          blanditiis consectetur dolorem doloribus eaque enim, eos et facere id
          illum ipsa ipsam iusto maxime minima minus necessitatibus neque nobis
          nostrum numquam optio placeat quae qui ut vitae, voluptate! Aspernatur
          aut, consequuntur eaque minima molestias, nihil, nostrum officia
          pariatur porro quas quidem voluptas. Aliquid, deserunt distinctio,
          dolor et explicabo ipsam magni modi natus provident, reiciendis rem.
        </div>
        <div className={styles.home__4}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi
          assumenda atque aut beatae distinctio dolorem illo, nostrum
          reprehenderit sapiente suscipit! Animi architecto aspernatur atque
          excepturi inventore necessitatibus, non qui voluptates? Adipisci amet
          aperiam dolore earum ex explicabo, impedit, iste, iure laudantium
          minima molestias mollitia nulla pariatur soluta voluptatum. Aliquam
          aliquid architecto, at blanditiis dolore doloremque ex excepturi
          facere maxime nihil, nobis officia, perferendis praesentium qui
          quisquam reprehenderit repudiandae vel voluptas? Aperiam architecto
          consectetur dolorem enim, error esse exercitationem in molestias,
          nesciunt nobis quaerat quasi, rem repellendus sit suscipit vero
          voluptatem! Aliquam asperiores cupiditate illum in minima molestiae
          necessitatibus nemo nihil odit officiis, perspiciatis possimus quam
          quia, reiciendis rem sequi, sint sit soluta suscipit voluptatem.
          Aliquid animi asperiores beatae blanditiis corporis cum cupiditate
          debitis delectus dicta dignissimos doloremque ducimus ea et excepturi
          exercitationem illum incidunt laudantium mollitia natus nostrum odit
          officiis quam quas quo recusandae reiciendis rem sequi sint, sit ut
          velit vitae voluptatem voluptatibus. At cumque eum fuga minus
          molestias quibusdam rerum totam veritatis, voluptate. Ad architecto
          autem beatae culpa delectus earum esse est explicabo fuga id illo in
          ipsa ipsam laboriosam maiores maxime mollitia nostrum obcaecati odio,
          placeat porro quas, quasi reiciendis repudiandae sequi, vero
          voluptates. Eveniet, quos, soluta!
        </div>
        <AnimatedBlocks />
        <div className={styles.home__6}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          excepturi illo quidem. Aut cum minus non! Autem beatae culpa cumque
          dolorem ea eaque facilis hic, illo, inventore ipsam maiores minima
          nemo nisi nobis porro quaerat quidem quis quos repudiandae voluptas!
          Accusamus, adipisci at autem beatae dicta, dignissimos eum neque,
          officia quae quas quo reiciendis rem ullam! Corporis cum repudiandae
          tenetur! Ab aperiam deserunt distinctio ducimus enim natus officiis
          possimus, quis quos, ullam ut, voluptate. Adipisci aperiam atque
          blanditiis dignissimos dolor doloribus, eveniet explicabo hic illum
          iure laborum molestiae mollitia non nulla odit quas quis repellendus,
          ullam voluptatem voluptates! Assumenda, commodi inventore ipsam
          laudantium nam non optio quibusdam vel veniam! Itaque, nihil, velit?
          Ad dicta, doloremque dolores ea excepturi explicabo facilis fugiat
          maiores minus neque optio quod ratione recusandae repellendus saepe
          sequi similique ut vero vitae voluptatum. Ad, autem blanditiis
          corporis, ducimus harum laudantium maxime natus, necessitatibus
          obcaecati optio sunt totam veritatis voluptatibus. Amet aperiam beatae
          et excepturi, fugiat reprehenderit sed! Accusantium ex possimus,
          quaerat quidem rerum ullam voluptatum. At doloribus eligendi est,
          excepturi explicabo facilis impedit incidunt iusto labore laborum
          maxime molestias necessitatibus, nobis non nostrum, omnis perferendis
          possimus quam qui quos rem repudiandae sequi soluta ut voluptate!
          Doloribus, omnis.
        </div>
        <div className={styles.home__3}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
          asperiores consequatur cum deleniti dolore dolores eveniet fugit
          inventore iste iure laudantium nesciunt nobis perferendis quae quia
          quibusdam, quidem quos ut velit, voluptatibus! Accusantium, aliquid
          consequatur dolorem, dolores doloribus, ducimus enim eos est hic in
          ipsum nihil officia perspiciatis possimus quas tenetur vero. A aliquam
          aspernatur atque blanditiis consectetur consequatur culpa debitis
          deserunt dicta doloribus ducimus ea explicabo fugiat fugit harum
          libero minima nesciunt obcaecati, odio officiis pariatur placeat,
          praesentium quas quibusdam quisquam rerum tempore vero voluptatem
          voluptates voluptatibus. Aspernatur dolorem eveniet, impedit in minima
          odit perferendis quod? Aspernatur aut beatae laborum optio
          perferendis, repudiandae? Accusamus aliquam aliquid asperiores
          consectetur cum cumque delectus dolor doloremque enim error est
          excepturi facere fugiat in inventore iusto laboriosam maiores nisi
          numquam odit omnis quam quasi qui, quo recusandae repellendus
          reprehenderit sequi ullam unde voluptatum? A accusantium aliquid at
          blanditiis consectetur dolorem doloribus eaque enim, eos et facere id
          illum ipsa ipsam iusto maxime minima minus necessitatibus neque nobis
          nostrum numquam optio placeat quae qui ut vitae, voluptate! Aspernatur
          aut, consequuntur eaque minima molestias, nihil, nostrum officia
          pariatur porro quas quidem voluptas. Aliquid, deserunt distinctio,
          dolor et explicabo ipsam magni modi natus provident, reiciendis rem.
        </div>
        <AnimatedBlocksTwo />
        <div className={styles.home__5}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
          architecto consequatur cumque delectus doloremque, esse est et labore
          minima nam nisi obcaecati, odit pariatur placeat quibusdam vitae,
          voluptate! Ab amet asperiores aspernatur assumenda at blanditiis
          consectetur consequatur culpa cum cupiditate dicta dignissimos
          doloremque dolores doloribus eaque enim et eum excepturi explicabo hic
          illo iste libero maxime natus non porro provident quas quo repellendus
          saepe sapiente similique sint tempore, temporibus velit vitae
          voluptatum! A dicta eius error eum minima necessitatibus nesciunt,
          nostrum veniam. A ab, alias cupiditate eaque fuga inventore laborum
          maiores nesciunt, nihil nobis nulla omnis quia tempore temporibus
          vitae! A animi consequatur deleniti dolorem doloribus et fugit
          incidunt iure magnam molestias, nemo nobis odit officia quam quidem
          quis quo rem repellendus saepe similique sit suscipit ullam veniam,
          voluptas voluptatem? Ab dignissimos dolore dolores doloribus eius est
          eveniet facere facilis illo itaque, laborum libero molestias nobis
          omnis optio perspiciatis placeat quasi quis quisquam recusandae
          repellat repudiandae suscipit ullam unde ut vero voluptas, voluptates?
          Amet atque aut cum debitis, deleniti deserunt dicta dolor enim error
          est facere id libero molestiae nobis possimus provident quam quis
          quisquam quod ratione, reiciendis repudiandae saepe sequi suscipit
          temporibus ut, voluptas! Dolorem nostrum quo ullam voluptatem.
        </div>
        <div className={styles.home__6}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          excepturi illo quidem. Aut cum minus non! Autem beatae culpa cumque
          dolorem ea eaque facilis hic, illo, inventore ipsam maiores minima
          nemo nisi nobis porro quaerat quidem quis quos repudiandae voluptas!
          Accusamus, adipisci at autem beatae dicta, dignissimos eum neque,
          officia quae quas quo reiciendis rem ullam! Corporis cum repudiandae
          tenetur! Ab aperiam deserunt distinctio ducimus enim natus officiis
          possimus, quis quos, ullam ut, voluptate. Adipisci aperiam atque
          blanditiis dignissimos dolor doloribus, eveniet explicabo hic illum
          iure laborum molestiae mollitia non nulla odit quas quis repellendus,
          ullam voluptatem voluptates! Assumenda, commodi inventore ipsam
          laudantium nam non optio quibusdam vel veniam! Itaque, nihil, velit?
          Ad dicta, doloremque dolores ea excepturi explicabo facilis fugiat
          maiores minus neque optio quod ratione recusandae repellendus saepe
          sequi similique ut vero vitae voluptatum. Ad, autem blanditiis
          corporis, ducimus harum laudantium maxime natus, necessitatibus
          obcaecati optio sunt totam veritatis voluptatibus. Amet aperiam beatae
          et excepturi, fugiat reprehenderit sed! Accusantium ex possimus,
          quaerat quidem rerum ullam voluptatum. At doloribus eligendi est,
          excepturi explicabo facilis impedit incidunt iusto labore laborum
          maxime molestias necessitatibus, nobis non nostrum, omnis perferendis
          possimus quam qui quos rem repudiandae sequi soluta ut voluptate!
          Doloribus, omnis.
        </div>
        <AnimatedBlocksThree />
        <div className={styles.home__5}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
          architecto consequatur cumque delectus doloremque, esse est et labore
          minima nam nisi obcaecati, odit pariatur placeat quibusdam vitae,
          voluptate! Ab amet asperiores aspernatur assumenda at blanditiis
          consectetur consequatur culpa cum cupiditate dicta dignissimos
          doloremque dolores doloribus eaque enim et eum excepturi explicabo hic
          illo iste libero maxime natus non porro provident quas quo repellendus
          saepe sapiente similique sint tempore, temporibus velit vitae
          voluptatum! A dicta eius error eum minima necessitatibus nesciunt,
          nostrum veniam. A ab, alias cupiditate eaque fuga inventore laborum
          maiores nesciunt, nihil nobis nulla omnis quia tempore temporibus
          vitae! A animi consequatur deleniti dolorem doloribus et fugit
          incidunt iure magnam molestias, nemo nobis odit officia quam quidem
          quis quo rem repellendus saepe similique sit suscipit ullam veniam,
          voluptas voluptatem? Ab dignissimos dolore dolores doloribus eius est
          eveniet facere facilis illo itaque, laborum libero molestias nobis
          omnis optio perspiciatis placeat quasi quis quisquam recusandae
          repellat repudiandae suscipit ullam unde ut vero voluptas, voluptates?
          Amet atque aut cum debitis, deleniti deserunt dicta dolor enim error
          est facere id libero molestiae nobis possimus provident quam quis
          quisquam quod ratione, reiciendis repudiandae saepe sequi suscipit
          temporibus ut, voluptas! Dolorem nostrum quo ullam voluptatem.
        </div>
        <div className={styles.home__6}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          excepturi illo quidem. Aut cum minus non! Autem beatae culpa cumque
          dolorem ea eaque facilis hic, illo, inventore ipsam maiores minima
          nemo nisi nobis porro quaerat quidem quis quos repudiandae voluptas!
          Accusamus, adipisci at autem beatae dicta, dignissimos eum neque,
          officia quae quas quo reiciendis rem ullam! Corporis cum repudiandae
          tenetur! Ab aperiam deserunt distinctio ducimus enim natus officiis
          possimus, quis quos, ullam ut, voluptate. Adipisci aperiam atque
          blanditiis dignissimos dolor doloribus, eveniet explicabo hic illum
          iure laborum molestiae mollitia non nulla odit quas quis repellendus,
          ullam voluptatem voluptates! Assumenda, commodi inventore ipsam
          laudantium nam non optio quibusdam vel veniam! Itaque, nihil, velit?
          Ad dicta, doloremque dolores ea excepturi explicabo facilis fugiat
          maiores minus neque optio quod ratione recusandae repellendus saepe
          sequi similique ut vero vitae voluptatum. Ad, autem blanditiis
          corporis, ducimus harum laudantium maxime natus, necessitatibus
          obcaecati optio sunt totam veritatis voluptatibus. Amet aperiam beatae
          et excepturi, fugiat reprehenderit sed! Accusantium ex possimus,
          quaerat quidem rerum ullam voluptatum. At doloribus eligendi est,
          excepturi explicabo facilis impedit incidunt iusto labore laborum
          maxime molestias necessitatibus, nobis non nostrum, omnis perferendis
          possimus quam qui quos rem repudiandae sequi soluta ut voluptate!
          Doloribus, omnis.
        </div>
        <div className={styles.home__5}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
          architecto consequatur cumque delectus doloremque, esse est et labore
          minima nam nisi obcaecati, odit pariatur placeat quibusdam vitae,
          voluptate! Ab amet asperiores aspernatur assumenda at blanditiis
          consectetur consequatur culpa cum cupiditate dicta dignissimos
          doloremque dolores doloribus eaque enim et eum excepturi explicabo hic
          illo iste libero maxime natus non porro provident quas quo repellendus
          saepe sapiente similique sint tempore, temporibus velit vitae
          voluptatum! A dicta eius error eum minima necessitatibus nesciunt,
          nostrum veniam. A ab, alias cupiditate eaque fuga inventore laborum
          maiores nesciunt, nihil nobis nulla omnis quia tempore temporibus
          vitae! A animi consequatur deleniti dolorem doloribus et fugit
          incidunt iure magnam molestias, nemo nobis odit officia quam quidem
          quis quo rem repellendus saepe similique sit suscipit ullam veniam,
          voluptas voluptatem? Ab dignissimos dolore dolores doloribus eius est
          eveniet facere facilis illo itaque, laborum libero molestias nobis
          omnis optio perspiciatis placeat quasi quis quisquam recusandae
          repellat repudiandae suscipit ullam unde ut vero voluptas, voluptates?
          Amet atque aut cum debitis, deleniti deserunt dicta dolor enim error
          est facere id libero molestiae nobis possimus provident quam quis
          quisquam quod ratione, reiciendis repudiandae saepe sequi suscipit
          temporibus ut, voluptas! Dolorem nostrum quo ullam voluptatem.
        </div>
        <div className={styles.home__6}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          excepturi illo quidem. Aut cum minus non! Autem beatae culpa cumque
          dolorem ea eaque facilis hic, illo, inventore ipsam maiores minima
          nemo nisi nobis porro quaerat quidem quis quos repudiandae voluptas!
          Accusamus, adipisci at autem beatae dicta, dignissimos eum neque,
          officia quae quas quo reiciendis rem ullam! Corporis cum repudiandae
          tenetur! Ab aperiam deserunt distinctio ducimus enim natus officiis
          possimus, quis quos, ullam ut, voluptate. Adipisci aperiam atque
          blanditiis dignissimos dolor doloribus, eveniet explicabo hic illum
          iure laborum molestiae mollitia non nulla odit quas quis repellendus,
          ullam voluptatem voluptates! Assumenda, commodi inventore ipsam
          laudantium nam non optio quibusdam vel veniam! Itaque, nihil, velit?
          Ad dicta, doloremque dolores ea excepturi explicabo facilis fugiat
          maiores minus neque optio quod ratione recusandae repellendus saepe
          sequi similique ut vero vitae voluptatum. Ad, autem blanditiis
          corporis, ducimus harum laudantium maxime natus, necessitatibus
          obcaecati optio sunt totam veritatis voluptatibus. Amet aperiam beatae
          et excepturi, fugiat reprehenderit sed! Accusantium ex possimus,
          quaerat quidem rerum ullam voluptatum. At doloribus eligendi est,
          excepturi explicabo facilis impedit incidunt iusto labore laborum
          maxime molestias necessitatibus, nobis non nostrum, omnis perferendis
          possimus quam qui quos rem repudiandae sequi soluta ut voluptate!
          Doloribus, omnis.
        </div>
      </div>
      <svg width="0" height="0">
        <clipPath id="puzzle-clip-1" clipPathUnits="objectBoundingBox">
          <path
            d="M0.0769 0 h0.8462 a0.0769 0.0796 0 0 1 0.0769 0.0796 v0.301
            a0.0769 0.0796 0 0 1 -0.0769 0.0796 h-0.293 a0.1538 0.1592 0 0 0 -0.1538 0.1592
            v0.301 a0.0769 0.0796 0 0 1 -0.0769 0.0796 h-0.322 a0.0769 0.0796 0 0 1 -0.0769
            -0.0796 v-0.841 a0.0769 0.0796 0 0 1 0.0769 -0.0796 Z"
          />
        </clipPath>
      </svg>
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="puzzle-clip-2" clipPathUnits="objectBoundingBox">
          <path
            d="M0.4127 0 h0.5340 a0.0528 0.0796 0 0 1 0.0528 0.0796 v0.3010
            a0.0528 0.0796 0 0 1 -0.0528 0.0796 h-0.2970 a0.1056 0.1592 0 0 0 -0.1056 0.1592
            v0.3010 a0.0528 0.0796 0 0 1 -0.0528 0.0796 h-0.4396 a0.0528 0.0796 0 0 1 -0.0528 -0.0796
            v-0.3010 a0.0528 0.0796 0 0 1 0.0528 -0.0796 h0.2013 a0.1056 0.1592 0 0 0 0.1056 -0.1592
            v-0.3010 a0.0528 0.0796 0 0 1 0.0528 -0.0796 Z"
          />
        </clipPath>
      </svg>
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="puzzle-clip-3" clipPathUnits="objectBoundingBox">
          <path
            d="M0.6484 0 h0.2842 a0.0674 0.0796 0 0 1 0.0674 0.0796 v0.841
            a0.0674 0.0796 0 0 1 -0.0674 0.0796 h-0.8653 a0.0674 0.0796 0 0 1 -0.0674 -0.0796
            v-0.3010 a0.0674 0.0796 0 0 1 0.0674 -0.0796 h0.3789 a0.1347 0.1592 0 0 0 0.1347 -0.1592
            v-0.3010 a0.0674 0.0796 0 0 1 0.0674 -0.0796 Z"
          />
        </clipPath>
      </svg>
    </>
  );
}
