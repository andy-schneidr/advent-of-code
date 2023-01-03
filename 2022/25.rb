module Day25
  class << self
    def part_one(input)
      total = 0
      input.each do |line|
        total += parse_snafu(line)
      end
      decimal_to_snafu(total)
    end

    def part_two(input)
      raise NotImplementedError
    end

    def parse_snafu(str)
      bits = str.strip.split("")
      power = 0
      result = 0
      while bits.length > 0
        num = bits.pop()
        if num == "0"
          result += 0
        elsif num == "1"
          result += 1 * (5 ** power)
        elsif num == "2"
          result += 2 * (5 ** power)
        elsif num == "-"
          result -= 1 * (5 ** power)
        elsif num == "="
          result -= 2 * (5 ** power)
        end
        power += 1
      end
      puts "translation: #{str.strip} -> #{result}"
      result
    end

    def decimal_to_snafu(num)
      # find the power of 5 we need??
      power = 0
      while true
        if 2 * (5 ** power) > num
          break
        end
        power += 1
      end
      puts "power required: #{power}"
      number_remaining = num
      result = ""
      vals = ["=", "-", "0", "1", "2"]
      while power >= 0
        diffs = []
        diffs << number_remaining - (-2 * (5 ** power))
        diffs << number_remaining - (-1 * (5 ** power))
        diffs << number_remaining - (0 * (5 ** power))
        diffs << number_remaining - (1 * (5 ** power))
        diffs << number_remaining - (2 * (5 ** power))
        puts "diffs : #{diffs.to_s}"
        abs_diffs = diffs.map { |val| val.abs }
        value, idx = abs_diffs.each_with_index.min
        puts "value: #{value} idx: #{idx}"
        number_remaining = diffs[idx]
        result += vals[idx]
        power -= 1
      end
      result
    end
  end
end

lines = File.readlines("examples/25/25.txt")
# puts Day25.part_one(lines)
# puts Day25.part_two(lines)
lines = File.readlines("inputs/25.txt")
puts Day25.part_one(lines)
# puts Day25.part_two(lines)
