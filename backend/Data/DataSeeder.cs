using Microsoft.EntityFrameworkCore;
using development.Models;

namespace development.Data;

public static class DataSeeder
{
    public static void Seed(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AuraDbContext>();

        db.Database.EnsureCreated();

        // Run migrations for new columns (EnsureCreated doesn't update existing tables)
        try
        {
            db.Database.ExecuteSqlRaw(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                                   WHERE table_name = 'Users' AND column_name = 'LastLoginAt') THEN
                        ALTER TABLE ""Users"" ADD COLUMN ""LastLoginAt"" TIMESTAMP NOT NULL DEFAULT NOW();
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                                   WHERE table_name = 'Users' AND column_name = 'LoginCount') THEN
                        ALTER TABLE ""Users"" ADD COLUMN ""LoginCount"" INTEGER NOT NULL DEFAULT 0;
                    END IF;
                END $$;
            ");

            // Create ActivityLogs table if not exists
            db.Database.ExecuteSqlRaw(@"
                CREATE TABLE IF NOT EXISTS ""ActivityLogs"" (
                    ""Id"" SERIAL PRIMARY KEY,
                    ""Type"" INTEGER NOT NULL DEFAULT 0,
                    ""UserId"" INTEGER,
                    ""UserName"" VARCHAR(255) NOT NULL DEFAULT '',
                    ""UserEmail"" VARCHAR(255) NOT NULL DEFAULT '',
                    ""Description"" TEXT NOT NULL DEFAULT '',
                    ""RelatedId"" INTEGER,
                    ""CreatedAt"" TIMESTAMP NOT NULL DEFAULT NOW()
                );
                CREATE INDEX IF NOT EXISTS ""IX_ActivityLogs_Type"" ON ""ActivityLogs"" (""Type"");
                CREATE INDEX IF NOT EXISTS ""IX_ActivityLogs_CreatedAt"" ON ""ActivityLogs"" (""CreatedAt"");
            ");

            // Fix all NULL values in existing data
            db.Database.ExecuteSqlRaw(@"
                UPDATE ""Users"" SET ""SessionToken"" = '' WHERE ""SessionToken"" IS NULL;
                UPDATE ""Users"" SET ""TokenExpiry"" = '1970-01-01' WHERE ""TokenExpiry"" IS NULL;
                UPDATE ""Users"" SET ""UpdatedAt"" = ""CreatedAt"" WHERE ""UpdatedAt"" IS NULL;
                UPDATE ""Users"" SET ""LastLoginAt"" = ""CreatedAt"" WHERE ""LastLoginAt"" IS NULL;

                UPDATE ""Reservations"" SET ""TableNumber"" = 0 WHERE ""TableNumber"" IS NULL;
                UPDATE ""Reservations"" SET ""SpecialRequests"" = '' WHERE ""SpecialRequests"" IS NULL;
                UPDATE ""Reservations"" SET ""AdminNotes"" = '' WHERE ""AdminNotes"" IS NULL;
                UPDATE ""Reservations"" SET ""UpdatedAt"" = ""CreatedAt"" WHERE ""UpdatedAt"" IS NULL;

                UPDATE ""MenuItems"" SET ""Description"" = '' WHERE ""Description"" IS NULL;
                UPDATE ""MenuItems"" SET ""ImageUrl"" = '' WHERE ""ImageUrl"" IS NULL;
                UPDATE ""MenuItems"" SET ""Allergens"" = '' WHERE ""Allergens"" IS NULL;
                UPDATE ""MenuItems"" SET ""UpdatedAt"" = ""CreatedAt"" WHERE ""UpdatedAt"" IS NULL;

                UPDATE ""DaySchedules"" SET ""OpenTime"" = '12:00' WHERE ""OpenTime"" IS NULL;
                UPDATE ""DaySchedules"" SET ""CloseTime"" = '22:00' WHERE ""CloseTime"" IS NULL;
                UPDATE ""DaySchedules"" SET ""UpdatedAt"" = NOW() WHERE ""UpdatedAt"" IS NULL;

                UPDATE ""DateOverrides"" SET ""OpenTime"" = '' WHERE ""OpenTime"" IS NULL;
                UPDATE ""DateOverrides"" SET ""CloseTime"" = '' WHERE ""CloseTime"" IS NULL;
                UPDATE ""DateOverrides"" SET ""Reason"" = '' WHERE ""Reason"" IS NULL;

                -- Make all days open by default (admin can close specific days via DateOverrides)
                UPDATE ""DaySchedules"" SET ""IsOpen"" = true;

                -- Update menu item images (consistent 400x300 crop)
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop' WHERE ""Name"" = 'Carpaccio od tune';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop' WHERE ""Name"" = 'Bruschetta';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop' WHERE ""Name"" = 'Pršut i sir';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop' WHERE ""Name"" = 'Tartar od lososa';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop' WHERE ""Name"" = 'Juha od rajčice';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&h=300&fit=crop' WHERE ""Name"" = 'Riblja juha';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&h=300&fit=crop' WHERE ""Name"" = 'Goveđa juha';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop' WHERE ""Name"" = 'Cezar salata';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop' WHERE ""Name"" = 'Grčka salata';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' WHERE ""Name"" = 'Salata s kozjim sirom';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop' WHERE ""Name"" = 'Spaghetti Carbonara';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop' WHERE ""Name"" = 'Penne Arrabiata';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop' WHERE ""Name"" = 'Crni rižot';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&h=300&fit=crop' WHERE ""Name"" = 'Tagliatelle s tartufima';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop' WHERE ""Name"" = 'Brancin na žaru';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop' WHERE ""Name"" = 'Hobotnica ispod peke';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&h=300&fit=crop' WHERE ""Name"" = 'Škampi na buzaru';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' WHERE ""Name"" = 'Tuna steak';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop' WHERE ""Name"" = 'Biftek na žaru';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop' WHERE ""Name"" = 'Janjetina ispod peke';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop' WHERE ""Name"" = 'Pureći odrezak';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop' WHERE ""Name"" = 'Ćevapi';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop' WHERE ""Name"" = 'Tiramisu';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' WHERE ""Name"" = 'Panna cotta';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop' WHERE ""Name"" = 'Čokoladni lava cake';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop' WHERE ""Name"" = 'Voćna salata';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop' WHERE ""Name"" = 'Espresso';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' WHERE ""Name"" = 'Cappuccino';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop' WHERE ""Name"" = 'Svježe cijeđeni sok';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop' WHERE ""Name"" = 'Mineralna voda';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400&h=300&fit=crop' WHERE ""Name"" = 'Domaća limunada';
                UPDATE ""MenuItems"" SET ""ImageUrl"" = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop' WHERE ""Name"" = 'Specijalitet dana';
            ");
            Console.WriteLine("Database schema and data cleaned up successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Migration note: {ex.Message}");
        }

        // Seed Croatian public holidays (neradni dani)
        SeedHolidays(db);

        // Seed admin user
        SeedAdmin(db);

        // Seed default schedule
        SeedSchedule(db);

        // Seed menu items
        SeedMenu(db);
    }

    private static void SeedHolidays(AuraDbContext db)
    {
        if (!db.DateOverrides.Any())
        {
            var holidays = new List<DateOverride>();

            // Add holidays for 2026 and 2027
            foreach (var year in new[] { 2026, 2027 })
            {
                // Fixed holidays
                holidays.Add(new DateOverride { Date = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Nova godina" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 1, 6, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Sveta tri kralja (Bogojavljenje)" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 5, 1, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Praznik rada" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 5, 30, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Dan državnosti" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 6, 22, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Dan antifašističke borbe" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 8, 5, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Dan pobjede i domovinske zahvalnosti" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 8, 15, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Velika Gospa" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 11, 1, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Svi sveti" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 11, 18, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Dan sjećanja na žrtve Domovinskog rata" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 12, 25, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Božić" });
                holidays.Add(new DateOverride { Date = new DateTime(year, 12, 26, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Sveti Stjepan" });
            }

            // Easter dates (variable) - calculated for 2026 and 2027
            // 2026: Easter Sunday = April 5
            holidays.Add(new DateOverride { Date = new DateTime(2026, 4, 5, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Uskrs" });
            holidays.Add(new DateOverride { Date = new DateTime(2026, 4, 6, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Uskrsni ponedjeljak" });
            holidays.Add(new DateOverride { Date = new DateTime(2026, 5, 14, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Tijelovo" }); // Corpus Christi (60 days after Easter)

            // 2027: Easter Sunday = March 28
            holidays.Add(new DateOverride { Date = new DateTime(2027, 3, 28, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Uskrs" });
            holidays.Add(new DateOverride { Date = new DateTime(2027, 3, 29, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Uskrsni ponedjeljak" });
            holidays.Add(new DateOverride { Date = new DateTime(2027, 5, 6, 0, 0, 0, DateTimeKind.Utc), IsClosed = true, Reason = "Tijelovo" });

            foreach (var holiday in holidays)
            {
                holiday.CreatedAt = DateTime.UtcNow;
            }

            db.DateOverrides.AddRange(holidays);
            db.SaveChanges();
            Console.WriteLine($"Seeded {holidays.Count} Croatian public holidays for 2026-2027");
        }
    }

    private static void SeedAdmin(AuraDbContext db)
    {
        if (!db.Users.Any(u => u.IsAdmin))
        {
            var admin = new User
            {
                Name = "Administrator",
                Email = "david.kopic@aura.com",
                Phone = "",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("060307daki"),
                IsAdmin = true,
                CreatedAt = DateTime.UtcNow
            };
            db.Users.Add(admin);
            db.SaveChanges();
            Console.WriteLine("Admin user created: david.kopic@aura.com");
        }
    }

    private static void SeedSchedule(AuraDbContext db)
    {
        // Seed default schedule (Mon-Sun) - termini svakih sat vremena, 1 rezervacija po terminu
        if (!db.DaySchedules.Any())
        {
            // Termini od 12:00 do 23:00 svakih sat vremena (12 termina)
            var defaultSlots = new[] { "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00" };

            for (int i = 0; i < 7; i++)
            {
                var day = new DaySchedule
                {
                    DayOfWeek = (DayOfWeekEnum)i,
                    IsOpen = true, // All days open by default
                    OpenTime = "12:00",
                    CloseTime = "22:00"
                };
                db.DaySchedules.Add(day);
                db.SaveChanges();

                // Add time slots - 1 rezervacija po terminu
                foreach (var slotTime in defaultSlots)
                {
                    db.TimeSlots.Add(new TimeSlot
                    {
                        DayScheduleId = day.Id,
                        Time = slotTime,
                        MaxReservations = 1,  // Samo 1 rezervacija po terminu!
                        IsEnabled = true
                    });
                }
                db.SaveChanges();
            }
            Console.WriteLine("Default schedule created (Mon-Sat open, Sun closed) - 12 slots/day, 1 reservation/slot");
        }
    }

    private static void SeedMenu(AuraDbContext db)
    {
        if (!db.MenuItems.Any())
        {
            var menuItems = new List<MenuItem>
            {
                // Predjela (Appetizers)
                new MenuItem { Name = "Carpaccio od tune", Description = "Svježa tuna s rukolom, kaparima i parmezanom", Price = 14.90m, Category = MenuCategory.Appetizer, ImageUrl = "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Bruschetta", Description = "Hrskavi kruh s cherry rajčicama, bosiljkom i balzamiko kremom", Price = 8.90m, Category = MenuCategory.Appetizer, ImageUrl = "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400", IsAvailable = true, IsVegetarian = true, IsVegan = true, SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Pršut i sir", Description = "Dalmatinski pršut s domaćim sirom i maslinama", Price = 12.90m, Category = MenuCategory.Appetizer, ImageUrl = "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Tartar od lososa", Description = "Svježi losos s avokadom i sezamom", Price = 15.90m, Category = MenuCategory.Appetizer, ImageUrl = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 4, CreatedAt = DateTime.UtcNow },

                // Juhe (Soups)
                new MenuItem { Name = "Juha od rajčice", Description = "Kremasta juha od pečenih rajčica s bosiljkom", Price = 6.90m, Category = MenuCategory.Soup, ImageUrl = "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400", IsAvailable = true, IsVegetarian = true, IsVegan = true, IsGlutenFree = true, SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Riblja juha", Description = "Tradicionalna dalmatinska riblja juha", Price = 9.90m, Category = MenuCategory.Soup, ImageUrl = "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Goveđa juha", Description = "Domaća goveđa juha s rezancima", Price = 7.90m, Category = MenuCategory.Soup, ImageUrl = "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400", IsAvailable = true, SortOrder = 3, CreatedAt = DateTime.UtcNow },

                // Salate (Salads)
                new MenuItem { Name = "Cezar salata", Description = "Romanska salata, piletina, parmezan, krutonsi i Cezar dressing", Price = 11.90m, Category = MenuCategory.Salad, ImageUrl = "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400", IsAvailable = true, SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Grčka salata", Description = "Rajčice, krastavci, paprika, luk, masline i feta sir", Price = 9.90m, Category = MenuCategory.Salad, ImageUrl = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400", IsAvailable = true, IsVegetarian = true, IsGlutenFree = true, SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Salata s kozjim sirom", Description = "Mješana salata s toplim kozjim sirom i orasima", Price = 12.90m, Category = MenuCategory.Salad, ImageUrl = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", IsAvailable = true, IsVegetarian = true, IsGlutenFree = true, SortOrder = 3, CreatedAt = DateTime.UtcNow },

                // Tjestenina (Pasta)
                new MenuItem { Name = "Spaghetti Carbonara", Description = "Spaghetti s guanciale, jajima i pecorino sirom", Price = 13.90m, Category = MenuCategory.Pasta, ImageUrl = "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", IsAvailable = true, SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Penne Arrabiata", Description = "Penne s ljutim umakom od rajčice", Price = 11.90m, Category = MenuCategory.Pasta, ImageUrl = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400", IsAvailable = true, IsVegetarian = true, IsVegan = true, SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Crni rižot", Description = "Rižot s tintom od sipe i plodovima mora", Price = 16.90m, Category = MenuCategory.Pasta, ImageUrl = "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Tagliatelle s tartufima", Description = "Domaća tjestenina s crnim tartufima", Price = 22.90m, Category = MenuCategory.Pasta, ImageUrl = "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400", IsAvailable = true, IsVegetarian = true, SortOrder = 4, CreatedAt = DateTime.UtcNow },

                // Ribe (Fish)
                new MenuItem { Name = "Brancin na žaru", Description = "Svježi brancin s povrćem na žaru i blitvom", Price = 24.90m, Category = MenuCategory.Fish, ImageUrl = "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Hobotnica ispod peke", Description = "Hobotnica s krumpirom ispod peke", Price = 26.90m, Category = MenuCategory.Fish, ImageUrl = "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Škampi na buzaru", Description = "Škampi u umaku od bijelog vina i češnjaka", Price = 28.90m, Category = MenuCategory.Fish, ImageUrl = "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400", IsAvailable = true, SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Tuna steak", Description = "Tuna steak srednje pečena s wakame salatom", Price = 27.90m, Category = MenuCategory.Fish, ImageUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 4, CreatedAt = DateTime.UtcNow },

                // Meso (Meat)
                new MenuItem { Name = "Biftek na žaru", Description = "300g biftek s pečenim povrćem i umakom od vina", Price = 32.90m, Category = MenuCategory.Meat, ImageUrl = "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Janjetina ispod peke", Description = "Janjetina s krumpirom ispod peke", Price = 28.90m, Category = MenuCategory.Meat, ImageUrl = "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Pureći odrezak", Description = "Pureći odrezak s pireom i umakom od gljiva", Price = 18.90m, Category = MenuCategory.Meat, ImageUrl = "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400", IsAvailable = true, IsGlutenFree = true, SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Ćevapi", Description = "10 ćevapa s lepinjom, lukom i kajmakom", Price = 14.90m, Category = MenuCategory.Meat, ImageUrl = "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400", IsAvailable = true, SortOrder = 4, CreatedAt = DateTime.UtcNow },

                // Deserti (Desserts)
                new MenuItem { Name = "Tiramisu", Description = "Klasični talijanski desert s espressom i mascarponeom", Price = 7.90m, Category = MenuCategory.Dessert, ImageUrl = "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", IsAvailable = true, IsVegetarian = true, SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Panna cotta", Description = "Talijanski kremasti desert s voćnim umakom", Price = 6.90m, Category = MenuCategory.Dessert, ImageUrl = "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", IsAvailable = true, IsVegetarian = true, IsGlutenFree = true, SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Čokoladni lava cake", Description = "Topli čokoladni kolač s tekućom jezgrom", Price = 8.90m, Category = MenuCategory.Dessert, ImageUrl = "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400", IsAvailable = true, IsVegetarian = true, SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Voćna salata", Description = "Svježe sezonsko voće s mentom", Price = 5.90m, Category = MenuCategory.Dessert, ImageUrl = "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400", IsAvailable = true, IsVegetarian = true, IsVegan = true, IsGlutenFree = true, SortOrder = 4, CreatedAt = DateTime.UtcNow },

                // Pića (Beverages)
                new MenuItem { Name = "Espresso", Description = "Talijanska kava", Price = 2.50m, Category = MenuCategory.Beverage, ImageUrl = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400", IsAvailable = true, IsVegan = true, IsGlutenFree = true, SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Cappuccino", Description = "Espresso s mlijekom i mliječnom pjenom", Price = 3.50m, Category = MenuCategory.Beverage, ImageUrl = "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400", IsAvailable = true, IsVegetarian = true, IsGlutenFree = true, SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Svježe cijeđeni sok", Description = "Naranča, jabuka ili grejp", Price = 4.50m, Category = MenuCategory.Beverage, ImageUrl = "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400", IsAvailable = true, IsVegan = true, IsGlutenFree = true, SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Mineralna voda", Description = "0.75l", Price = 3.00m, Category = MenuCategory.Beverage, ImageUrl = "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=400", IsAvailable = true, IsVegan = true, IsGlutenFree = true, SortOrder = 4, CreatedAt = DateTime.UtcNow },
                new MenuItem { Name = "Domaća limunada", Description = "Svježa limunada s mentom", Price = 4.00m, Category = MenuCategory.Beverage, ImageUrl = "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400", IsAvailable = true, IsVegan = true, IsGlutenFree = true, SortOrder = 5, CreatedAt = DateTime.UtcNow },

                // Specijaliteti dana (Daily Specials)
                new MenuItem { Name = "Specijalitet dana", Description = "Pitajte konobara za današnji specijalitet", Price = 19.90m, Category = MenuCategory.Special, ImageUrl = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", IsAvailable = true, SortOrder = 1, CreatedAt = DateTime.UtcNow }
            };

            db.MenuItems.AddRange(menuItems);
            db.SaveChanges();
            Console.WriteLine($"Seeded {menuItems.Count} menu items");
        }
    }
}
