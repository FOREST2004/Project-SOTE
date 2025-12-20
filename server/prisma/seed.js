import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('=�  Clearing existing data...');

  // Delete all data in correct order (respect foreign keys)
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  console.log(' Data cleared!');
  console.log('<1 Starting to seed...');

  // Password hash (m�t kh�u: 123456)
  const passwordHash = await bcrypt.hash('1234567890', 10);

  // Create Users (20 users)
  console.log('=e Creating users...');
  const users = await Promise.all([
    prisma.user.create({ data: { id: 'user-001', email: 'admin@cinema.vn', password: passwordHash, fullName: 'Nguy�n Vn Admin', role: 'ADMIN' }}),
    prisma.user.create({ data: { id: 'user-002', email: 'nguyen.van.an@email.vn', password: passwordHash, fullName: 'Nguy�n Vn An', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-003', email: 'tran.thi.binh@email.vn', password: passwordHash, fullName: 'Tr�n Th� B�nh', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-004', email: 'le.hoang.cuong@email.vn', password: passwordHash, fullName: 'L� Ho�ng C��ng', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-005', email: 'pham.thi.dung@email.vn', password: passwordHash, fullName: 'Ph�m Th� Dung', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-006', email: 'vuong.minh.duc@email.vn', password: passwordHash, fullName: 'V��ng Minh �c', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-007', email: 'hoang.thi.em@email.vn', password: passwordHash, fullName: 'Ho�ng Th� Em', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-008', email: 'do.van.phong@email.vn', password: passwordHash, fullName: '� Vn Phong', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-009', email: 'bui.thi.giang@email.vn', password: passwordHash, fullName: 'B�i Th� Giang', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-010', email: 'ngo.minh.hai@email.vn', password: passwordHash, fullName: 'Ng� Minh H�i', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-011', email: 'dinh.thi.huong@email.vn', password: passwordHash, fullName: 'inh Th� H��ng', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-012', email: 'cao.van.khanh@email.vn', password: passwordHash, fullName: 'Cao Vn Kh�nh', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-013', email: 'ly.thi.lan@email.vn', password: passwordHash, fullName: 'L� Th� Lan', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-014', email: 'mai.van.minh@email.vn', password: passwordHash, fullName: 'Mai Vn Minh', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-015', email: 'truong.thi.nga@email.vn', password: passwordHash, fullName: 'Tr��ng Th� Nga', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-016', email: 'guest.user@email.vn', password: passwordHash, fullName: 'Kh�ch H�ng Th��ng', role: 'GUEST' }}),
    prisma.user.create({ data: { id: 'user-017', email: 'staff.phuc@cinema.vn', password: passwordHash, fullName: 'Nh�n Vi�n Ph�c', role: 'ADMIN' }}),
    prisma.user.create({ data: { id: 'user-018', email: 'dao.van.quang@email.vn', password: passwordHash, fullName: '�o Vn Quang', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-019', email: 'vu.thi.thao@email.vn', password: passwordHash, fullName: 'Vi Th� Th�o', role: 'MEMBER' }}),
    prisma.user.create({ data: { id: 'user-020', email: 'ha.van.tuan@email.vn', password: passwordHash, fullName: 'H� Vn Tu�n', role: 'MEMBER' }}),
  ]);

  // Create Rooms
  console.log('<� Creating rooms...');
  await Promise.all([
    prisma.room.create({ data: { id: 'room-001', name: 'Ph�ng Chi�u A1', rows: 10, seatsPerRow: 12 }}),
    prisma.room.create({ data: { id: 'room-002', name: 'Ph�ng Chi�u A2', rows: 8, seatsPerRow: 10 }}),
    prisma.room.create({ data: { id: 'room-003', name: 'Ph�ng Chi�u B1', rows: 12, seatsPerRow: 14 }}),
    prisma.room.create({ data: { id: 'room-004', name: 'Ph�ng Chi�u B2', rows: 10, seatsPerRow: 12 }}),
    prisma.room.create({ data: { id: 'room-005', name: 'Ph�ng Chi�u VIP1', rows: 6, seatsPerRow: 8 }}),
    prisma.room.create({ data: { id: 'room-006', name: 'Ph�ng Chi�u VIP2', rows: 6, seatsPerRow: 8 }}),
    prisma.room.create({ data: { id: 'room-007', name: 'Ph�ng Chi�u IMAX', rows: 15, seatsPerRow: 18 }}),
    prisma.room.create({ data: { id: 'room-008', name: 'Ph�ng Chi�u 4DX', rows: 8, seatsPerRow: 12 }}),
  ]);

  // Create Movies
  console.log('<� Creating movies...');
  const movies = [
    { id: 'movie-001', title: 'Avengers: Endgame', description: 'Cu�c chi�n cu�i c�ng c�a c�c si�u anh h�ng � c�u vi tr� kh�i Thanos.', duration: 181, genre: 'H�nh �ng', rating: 4.8, posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c', releaseDate: new Date('2019-04-26') },
    { id: 'movie-002', title: 'Spider-Man: No Way Home', description: 'Peter Parker ph�i �i m�t v�i nh�ng ph�n di�n t� c�c vi tr� kh�c nhau.', duration: 148, genre: 'H�nh �ng', rating: 4.7, posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA', releaseDate: new Date('2021-12-17') },
    { id: 'movie-003', title: 'Top Gun: Maverick', description: 'Pete "Maverick" Mitchell tr� l�i � hu�n luy�n th� h� phi c�ng m�i.', duration: 130, genre: 'H�nh �ng', rating: 4.6, posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', trailerUrl: 'https://www.youtube.com/watch?v=qSqVVswa420', releaseDate: new Date('2022-05-27') },
    { id: 'movie-004', title: 'Black Panther', description: 'T\'Challa tr� v� Wakanda � tr� th�nh vua v� b�o v� �t n��c.', duration: 134, genre: 'H�nh �ng', rating: 4.5, posterUrl: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', trailerUrl: 'https://www.youtube.com/watch?v=xjDjIWPwcPU', releaseDate: new Date('2018-02-16') },
    { id: 'movie-005', title: 'The Batman', description: 'Bruce Wayne tr� tu�i b�t �u h�nh tr�nh tr� th�nh Ng��i D�i.', duration: 176, genre: 'H�nh �ng', rating: 4.4, posterUrl: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4', releaseDate: new Date('2022-03-04') },
    { id: 'movie-006', title: 'Dune', description: 'Paul Atreides ph�i b�o v� gia �nh v� nh�n d�n tr�n h�nh tinh sa m�c Arrakis.', duration: 155, genre: 'Khoa h�c vi�n t��ng', rating: 4.3, posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', trailerUrl: 'https://www.youtube.com/watch?v=8g18jFHCLXk', releaseDate: new Date('2021-10-22') },
    { id: 'movie-007', title: 'Frozen 2', description: 'Anna v� Elsa kh�m ph� ngu�n g�c s�c m�nh c�a Elsa trong cu�c h�nh tr�nh m�i.', duration: 103, genre: 'Ho�t h�nh', rating: 4.2, posterUrl: 'https://image.tmdb.org/t/p/w500/xJWPZIYOEFIjZpBL7SVBGnzRYXp.jpg', trailerUrl: 'https://www.youtube.com/watch?v=Zi4LMpSDccc', releaseDate: new Date('2019-11-22') },
    { id: 'movie-008', title: 'Joker', description: 'C�u chuy�n v� s� bi�n �i c�a Arthur Fleck th�nh Joker.', duration: 122, genre: 'T�i ph�m', rating: 4.1, posterUrl: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', trailerUrl: 'https://www.youtube.com/watch?v=zAGVQLHvwOY', releaseDate: new Date('2019-10-04') },
    { id: 'movie-009', title: 'Fast & Furious 9', description: 'Dom v� gia �nh �i m�t v�i k� th� nguy hi�m nh�t t� tr��c �n nay.', duration: 143, genre: 'H�nh �ng', rating: 4.0, posterUrl: 'https://image.tmdb.org/t/p/w500/bOFaAXmWWXC3Rbv4u4uM9ZSzRXP.jpg', trailerUrl: 'https://www.youtube.com/watch?v=DdOts-F7XBU', releaseDate: new Date('2021-06-25') },
    { id: 'movie-010', title: 'Encanto', description: 'C�u chuy�n v� c� g�i tr� Mirabel trong gia �nh c� ph�p thu�t.', duration: 102, genre: 'Ho�t h�nh', rating: 4.4, posterUrl: 'https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg', trailerUrl: 'https://www.youtube.com/watch?v=CaimKeDcudo', releaseDate: new Date('2021-11-24') },
    { id: 'movie-011', title: 'Doctor Strange 2', description: 'Doctor Strange kh�m ph� a vi tr� v� �i m�t v�i nh�ng m�i e d�a m�i.', duration: 126, genre: 'H�nh �ng', rating: 4.2, posterUrl: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', trailerUrl: 'https://www.youtube.com/watch?v=aWzlQ2N6qqg', releaseDate: new Date('2022-05-06') },
    { id: 'movie-012', title: 'Minions: The Rise of Gru', description: 'Gru tr� tu�i mu�n gia nh�p nh�m t�i ph�m Vicious 6.', duration: 87, genre: 'Ho�t h�nh', rating: 4.0, posterUrl: 'https://image.tmdb.org/t/p/w500/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg', trailerUrl: 'https://www.youtube.com/watch?v=BqjNMr4OvYI', releaseDate: new Date('2022-07-01') },
    { id: 'movie-013', title: 'Thor: Love and Thunder', description: 'Thor h�p t�c v�i Jane Foster � ch�ng l�i Gorr the God Butcher.', duration: 119, genre: 'H�nh �ng', rating: 3.5, posterUrl: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', trailerUrl: 'https://www.youtube.com/watch?v=Go8nTmfrQd8', releaseDate: new Date('2022-07-08') },
    { id: 'movie-014', title: 'Black Widow', description: 'Natasha Romanoff �i m�t v�i qu� kh� en t�i c�a m�nh.', duration: 134, genre: 'H�nh �ng', rating: 4.1, posterUrl: 'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg', trailerUrl: 'https://www.youtube.com/watch?v=Fp9pNPdNwjI', releaseDate: new Date('2021-07-09') },
    { id: 'movie-015', title: 'Eternals', description: 'Nh�m si�u anh h�ng b�t t� t�i h�p � b�o v� Tr�i �t.', duration: 156, genre: 'H�nh �ng', rating: 3.8, posterUrl: 'https://image.tmdb.org/t/p/w500/lFByFSLV5WDJEv3KabbdAF959F2.jpg', trailerUrl: 'https://www.youtube.com/watch?v=0WVDKZJkGlY', releaseDate: new Date('2021-11-05') },
  ];

  for (const movie of movies) {
    await prisma.movie.create({ data: movie });
  }

  // Create Showtimes
  console.log('=� Creating showtimes...');
  const showtimes = [
    { id: 'showtime-001', movieId: 'movie-001', roomId: 'room-007', startTime: new Date('2025-12-21T09:00:00'), price: 150000 },
    { id: 'showtime-002', movieId: 'movie-001', roomId: 'room-007', startTime: new Date('2025-12-21T13:00:00'), price: 150000 },
    { id: 'showtime-003', movieId: 'movie-001', roomId: 'room-007', startTime: new Date('2025-12-21T17:00:00'), price: 180000 },
    { id: 'showtime-004', movieId: 'movie-001', roomId: 'room-007', startTime: new Date('2025-12-21T21:00:00'), price: 180000 },
    { id: 'showtime-005', movieId: 'movie-002', roomId: 'room-003', startTime: new Date('2025-12-21T10:00:00'), price: 120000 },
    { id: 'showtime-006', movieId: 'movie-002', roomId: 'room-003', startTime: new Date('2025-12-21T14:30:00'), price: 120000 },
    { id: 'showtime-007', movieId: 'movie-002', roomId: 'room-003', startTime: new Date('2025-12-21T19:00:00'), price: 150000 },
    { id: 'showtime-008', movieId: 'movie-002', roomId: 'room-008', startTime: new Date('2025-12-21T21:30:00'), price: 200000 },
    { id: 'showtime-009', movieId: 'movie-003', roomId: 'room-001', startTime: new Date('2025-12-21T11:00:00'), price: 100000 },
    { id: 'showtime-010', movieId: 'movie-003', roomId: 'room-001', startTime: new Date('2025-12-21T15:00:00'), price: 100000 },
    { id: 'showtime-011', movieId: 'movie-003', roomId: 'room-005', startTime: new Date('2025-12-21T20:00:00'), price: 180000 },
    { id: 'showtime-012', movieId: 'movie-004', roomId: 'room-002', startTime: new Date('2025-12-21T12:00:00'), price: 110000 },
    { id: 'showtime-013', movieId: 'movie-004', roomId: 'room-002', startTime: new Date('2025-12-21T16:30:00'), price: 110000 },
    { id: 'showtime-014', movieId: 'movie-005', roomId: 'room-004', startTime: new Date('2025-12-21T18:00:00'), price: 130000 },
    { id: 'showtime-015', movieId: 'movie-005', roomId: 'room-006', startTime: new Date('2025-12-21T21:00:00'), price: 170000 },
  ];

  for (const showtime of showtimes) {
    await prisma.showtime.create({ data: showtime });
  }

  // Create Bookings
  console.log('<�  Creating bookings...');
  const bookings = [
    { id: 'booking-001', userId: 'user-002', showtimeId: 'showtime-001', seats: '["A1", "A2"]', totalPrice: 300000, status: 'CONFIRMED' },
    { id: 'booking-002', userId: 'user-003', showtimeId: 'showtime-001', seats: '["B5", "B6", "B7"]', totalPrice: 450000, status: 'CONFIRMED' },
    { id: 'booking-003', userId: 'user-004', showtimeId: 'showtime-005', seats: '["C3", "C4"]', totalPrice: 240000, status: 'CONFIRMED' },
    { id: 'booking-004', userId: 'user-005', showtimeId: 'showtime-009', seats: '["D1"]', totalPrice: 100000, status: 'PENDING' },
    { id: 'booking-005', userId: 'user-006', showtimeId: 'showtime-012', seats: '["A8", "A9"]', totalPrice: 220000, status: 'CONFIRMED' },
  ];

  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }

  // Create Reviews
  console.log('P Creating reviews...');
  const reviews = [
    { id: 'review-001', userId: 'user-002', movieId: 'movie-001', rating: 5, comment: 'Phim hay nh�t m�i th�i �i! C�m x�c tr�n �y t� �u �n cu�i.' },
    { id: 'review-002', userId: 'user-003', movieId: 'movie-001', rating: 5, comment: 'K�t th�c ho�n h�o cho saga Infinity. Kh�ng th� t�t h�n ��c n�a!' },
    { id: 'review-003', userId: 'user-004', movieId: 'movie-002', rating: 4, comment: 'Tobey Maguire v� Andrew Garfield xu�t hi�n th�t s� l� b�t ng� tuy�t v�i.' },
    { id: 'review-004', userId: 'user-005', movieId: 'movie-002', rating: 5, comment: 'Multiverse ��c th�c hi�n m�t c�ch xu�t s�c. Tom Holland di�n r�t hay.' },
    { id: 'review-005', userId: 'user-006', movieId: 'movie-003', rating: 4, comment: 'Tom Cruise v�n c�n r�t ng�u � tu�i 60. Nh�ng c�nh bay th�t s� �n t��ng.' },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  console.log(' Seed completed successfully!');
  console.log('=� Summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Movies: ${movies.length}`);
  console.log(`   - Showtimes: ${showtimes.length}`);
  console.log(`   - Bookings: ${bookings.length}`);
  console.log(`   - Reviews: ${reviews.length}`);
  console.log('\n= Login credentials:');
  console.log('   Admin: admin@cinema.vn / 123456');
  console.log('   User: nguyen.van.an@email.vn / 123456');
}

main()
  .catch((e) => {
    console.error('L Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
