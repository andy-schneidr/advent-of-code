module Day01
  class << self
    def part_one(input)
      elf_calories = get_calories(input)
      elf_calories.max
    end

    def part_two(input)
      elf_calories = get_calories(input)
      puts elf_calories.max(3).sum()
    end

    def get_calories(input)
      # Declarative way
      current = 0
      elf_calories = []
      input.each do |calories|
        if calories.strip == ""
          elf_calories.append(current)
          current = 0
        else
          current += calories.to_i
        end
      end
      elf_calories.append(current)

      elf_calories
    end
  end
end

lines = File.readlines("examples/01/01.txt")
puts Day01.part_one(lines)
