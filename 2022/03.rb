module Day03
  class << self
    def part_one(input)
      total = 0
      input.each do |line|
        line1 = line[0, (line.length.to_f / 2).floor].split('')
        line2 = line[(line.length.to_f / 2).floor, line.length]
        line1.each do |char|
            if line2.count(char) > 0
              value = get_priority(char)
              total += value
              break
            end
        end
      end

      return total
    end

    def part_two(input)
      total = 0
      0.step(input.length - 1, 3) { |i|
        line0 = input[i].split('')
        line1 = input[i+1]
        line2 = input[i+2]
        line0.each do |char|
          if line1.count(char) > 0 && line2.count(char) > 0
            value = get_priority(char)
            total += value
            break
          end
        end
      }

      return total
    end


    def get_priority(letter)
      if letter.ord <= "a".ord
        return (letter.ord - 64) + 26
      end
      return letter.ord - 96
    end
  end
end

lines = File.readlines("examples/03/03.txt")
puts Day03.part_one(lines)
puts Day03.part_two(lines)

