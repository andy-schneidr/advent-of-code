module Day06
  class << self
    def part_one(input)
      find_unique_substr_idx(input[0], 4)
    end

    def part_two(input)
      find_unique_substr_idx(input[0], 14)
    end

    def find_unique_substr_idx(s, len)
      (len-1).step(s.length-1, 1) { |i|
        substring = s[(i-len+1)..i]
        if check_counts(substring)
          return i + 1
        end
      }
      return -1
    end

    def check_counts(substring)
      substring.split('').each do |char|
        if substring.count(char) != 1
          return false
        end
      end
      return true
    end
  end
end


lines = File.readlines("examples/06/06.txt")
puts Day06.part_one(lines)
puts Day06.part_two(lines)
lines = File.readlines("inputs/06.txt")
puts Day06.part_one(lines)
puts Day06.part_two(lines)
